// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: GRID_SIZE / 2, y: GRID_SIZE / 2 }];
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [food, setFood] = useState(generateRandomFood);
  const [isGameOver, setIsGameOver] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(moveSnake, 200);
    return () => clearInterval(intervalRef.current);
  }, [snake, direction]);

  useEffect(() => {
    if (isGameOver) {
      clearInterval(intervalRef.current);
      Alert.alert('Game Over', 'You lost!', [{ text: 'Restart', onPress: resetGame }]);
    }
  }, [isGameOver]);

  const generateRandomFood = () => {
    let x = Math.floor(Math.random() * GRID_SIZE);
    let y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(DIRECTIONS.RIGHT);
    setFood(generateRandomFood);
    setIsGameOver(false);
    intervalRef.current = setInterval(moveSnake, 200);
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || snakeCollision(newSnake, head)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateRandomFood);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const snakeCollision = (snake, head) => {
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  };

  const changeDirection = (newDirection) => {
    if (
      (direction === DIRECTIONS.UP && newDirection === DIRECTIONS.DOWN) ||
      (direction === DIRECTIONS.DOWN && newDirection === DIRECTIONS.UP) ||
      (direction === DIRECTIONS.LEFT && newDirection === DIRECTIONS.RIGHT) ||
      (direction === DIRECTIONS.RIGHT && newDirection === DIRECTIONS.LEFT)
    ) {
      return;
    }
    setDirection(newDirection);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {Array.from({ length: GRID_SIZE }).map((_, colIndex) => {
              const isSnakeCell = snake.some((cell) => cell.x === colIndex && cell.y === rowIndex);
              const isFoodCell = food.x === colIndex && food.y === rowIndex;
              return (
                <View
                  key={colIndex}
                  style={[
                    styles.cell,
                    isSnakeCell && styles.snakeCell,
                    isFoodCell && styles.foodCell,
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => changeDirection(DIRECTIONS.UP)} style={styles.controlButton}>
            <Text style={styles.controlText}>Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => changeDirection(DIRECTIONS.LEFT)} style={styles.controlButton}>
            <Text style={styles.controlText}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeDirection(DIRECTIONS.DOWN)} style={styles.controlButton}>
            <Text style={styles.controlText}>Down</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeDirection(DIRECTIONS.RIGHT)} style={styles.controlButton}>
            <Text style={styles.controlText}>Right</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  grid: {
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#ccc',
  },
  snakeCell: {
    backgroundColor: '#000',
  },
  foodCell: {
    backgroundColor: 'red',
  },
  controls: {
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#888',
    margin: 5,
  },
  controlText: {
    color: '#fff',
  },
});