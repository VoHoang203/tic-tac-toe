import { useEffect, useRef, useState } from 'react';
import './App.css';
import { toast } from 'react-toastify';
type Player = 'X' | 'O' | null;
function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string>('');
  const playerScore = useRef<number>(0); // Điểm của người chơi "X"
  const aiScore = useRef<number>(0); // Điểm của AI "O"
  const caculateWinner = (table: Player[]): Player | null => {
    const line = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < line.length; i++) {
      const [a, b, c] = line[i];
      if (table[a] && table[a] === table[b] && table[a] === table[c]) {
        return table[a];
      }
    }
    return null;
  };
  useEffect(() => {
    if (!isXNext && !winner) {
      setTimeout(() => makeAIMove(), 500);
    }
  }, [isXNext, winner]);

  const handleReset = () => {
    setIsXNext(true);
    setBoard(Array(9).fill(null));
    setWinner('');
  };

  const handleClick = (index: number) => {
    if (winner || board[index]) {
      if (board[index]) {
        toast.error('Please choose empty square');
      }
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const result = caculateWinner(newBoard);

    if (result) {
      setWinner(result);
      toast.success(`${result} win! congratulation`);
      if (result === 'X') {
        playerScore.current += 1;
      } else if (result === 'O') {
        aiScore.current += 1;
      }
    } else if (!newBoard.includes(null)) {
      toast.info('Result is draw. Reset to start new game.');
    } else {
      setIsXNext(!isXNext);
    }
  };

  const makeAIMove = (): void => {
    const emptySquares: number[] = board.reduce<number[]>((acc, val, idx) => {
      if (!val) acc.push(idx);
      return acc;
    }, []);

    if (emptySquares.length > 0) {
      const bestMove = findBestMove(board);
      if (bestMove !== null) {
        handleClick(bestMove);
      }
    }
  };
  //Move duy nhất để player thắng: 0 -> 8 -> 6 -> 7
  // Các chiến lược cơ bản của AI: Thắng -> Chặn đối thủ -> Lấy trung tâm -> Lấy góc -> Lấy ngẫu nhiên
  const findBestMove = (currentBoard: Player[]): number | null => {
    const aiPlayer: Player = 'O'; // AI là O
    const humanPlayer: Player = 'X'; // Người chơi là X

    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const boardCopy = [...currentBoard];
        boardCopy[i] = aiPlayer;
        if (caculateWinner(boardCopy) === aiPlayer) return i;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const boardCopy = [...currentBoard];
        boardCopy[i] = humanPlayer;
        if (caculateWinner(boardCopy) === humanPlayer) return i;
      }
    }

    if (!currentBoard[4]) return 4;

    const corners: number[] = [0, 2, 6, 8];
    const availableCorners: number[] = corners.filter((corner) => !currentBoard[corner]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    const availableSpaces: number[] = currentBoard
      .map((square, index) => (!square ? index : null))
      .filter((space): space is number => space !== null);
    if (availableSpaces.length > 0) {
      return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    }

    return null;
  };

  const cellRender = (index: number) => {
    return (
      <button
        onClick={() => handleClick(index)}
        className={`min-w-full min-h-24 border border-black cursor-pointer flex justify-center items-center font-bold text-4xl ${board[index] === 'X' ? 'text-red-500' : 'text-blue-500'
          } transform hover:scale-110 transition duration-200`}
      >
        {board[index]}
      </button>
    );
  };
  return (
    <>
      <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="text-2xl font-bold">Tic tac toe </div>

        <div className="flex justify-around w-full max-w-md mb-6">
          <div className="text-xl font-bold text-red-500">Player: {playerScore.current}</div>
          <div className="text-xl font-bold text-blue-500">AI: {aiScore.current}</div>
        </div>
        <div className="w-full max-w-md grid grid-cols-3 gap-4 my-3 ">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div className="" key={index}>
              {cellRender(index)}
            </div>
          ))}
        </div>
        <div className="text-2xl my-2">Next player: {isXNext ? 'X' : 'O'} </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg" onClick={handleReset}>
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
