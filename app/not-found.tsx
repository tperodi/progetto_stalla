"use client"

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  const paddleWidth = 60;
  const paddleHeight = 10;
  const ballRadius = 8;
  const brickRowCount = 3;
  const brickColumnCount = 5;

  const paddleX = useRef(120);
  const ball = useRef({ x: 160, y: 230, dx: 2, dy: -2 });
  const bricks = useRef<{ x: number; y: number; status: boolean }[][]>([]);
  const rightPressed = useRef(false);
  const leftPressed = useRef(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [restart, setRestart] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const brickWidth = 50;
    const brickHeight = 30;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 10;

    paddleX.current = 120;
    ball.current = { x: 160, y: 230, dx: 2, dy: -2 };
    setScore(0);
    setGameMessage(null);

    for (let c = 0; c < brickColumnCount; c++) {
      bricks.current[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks.current[c][r] = {
          x: 0,
          y: 0,
          status: true,
        };
      }
    }

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15'; // giallo per fieno
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX.current, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#333';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks.current[c][r];
          if (b.status) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            b.x = brickX;
            b.y = brickY;
            ctx.font = '20px Arial';
            ctx.fillText('🐮', brickX + 10, brickY + 20);
          }
        }
      }
    };

    const collisionDetection = () => {
      let allCleared = true;
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks.current[c][r];
          if (b.status) {
            allCleared = false;
            if (
              ball.current.x > b.x &&
              ball.current.x < b.x + brickWidth &&
              ball.current.y > b.y &&
              ball.current.y < b.y + brickHeight
            ) {
              ball.current.dy = -ball.current.dy;
              b.status = false;
              setScore((prev) => prev + 10);
            }
          }
        }
      }
      if (allCleared) {
        setGameMessage('Hai vinto! 🎉');
        ball.current.dx = 0;
        ball.current.dy = 0;
        cancelAnimationFrame(requestRef.current!);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (ball.current.x + ball.current.dx > canvas.width - ballRadius || ball.current.x + ball.current.dx < ballRadius) {
        ball.current.dx = -ball.current.dx;
      }
      if (ball.current.y + ball.current.dy < ballRadius) {
        ball.current.dy = -ball.current.dy;
      } else if (ball.current.y + ball.current.dy > canvas.height - ballRadius) {
        if (ball.current.x > paddleX.current && ball.current.x < paddleX.current + paddleWidth) {
          ball.current.dy = -ball.current.dy;
        } else {
          setGameMessage('Hai perso 😢');
          ball.current.dx = 0;
          ball.current.dy = 0;
          cancelAnimationFrame(requestRef.current!);
          return;
        }
      }

      if (rightPressed.current && paddleX.current < canvas.width - paddleWidth) {
        paddleX.current += 4;
      } else if (leftPressed.current && paddleX.current > 0) {
        paddleX.current -= 4;
      }

      ball.current.x += ball.current.dx;
      ball.current.y += ball.current.dy;
      requestRef.current = requestAnimationFrame(draw);
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed.current = true;
      if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed.current = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed.current = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed.current = false;
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(requestRef.current!);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [restart]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-2">404</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Oops! Pagina non trovata.
      </p>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Nel frattempo, gioca a Breakout 👇 Usa le frecce ⬅️ ➡️
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Punteggio: {score}</p>
      <canvas
        ref={canvasRef}
        width={320}
        height={250}
        className="border border-gray-300 rounded-lg shadow-md bg-white"
      />
      {gameMessage && (
        <>
          <p className="mt-4 text-xl font-semibold text-indigo-600">{gameMessage}</p>
          <button
            onClick={() => setRestart((r) => !r)}
            className="mt-2 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Rigioca
          </button>
        </>
      )}
      <Link
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Torna alla home
      </Link>
    </div>
  );
}