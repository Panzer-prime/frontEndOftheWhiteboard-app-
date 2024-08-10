"use client";
import { ConnectOnSocket } from "@/utils/sockets/connectOnSocket";
import React, { useState } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError, AxiosHeaders } from "axios";


const { socket } = ConnectOnSocket();

function App() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const handleRoomJoin = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const roomName = formData.get("roomName") as string;
    const getRoomPass = formData.get("RoomPass") as string;

    const urlRequest = `http://127.0.0.1:5000/api/getRoom`;

    await axios
      .post(
        urlRequest,
        {
          roomName,
          getRoomPass,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          const roomID = res.data.roomID;
          router.push("/whiteboard");
          socket.emit("join", { room: roomID });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
        const errorMessage = (error.response?.data as { msg: string })?.msg;
        setError(errorMessage);
      });
  };
  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const createRoomID = formData.get("createRoomID") as string;
    const getRoomPass = formData.get("roomPass") as string;

    console.log(getRoomPass, createRoomID, "somethign aint right");
    const urlRequest = "http://127.0.0.1:5000/api/room/new";

    await axios
      .post(
        urlRequest,
        {
          roomName: createRoomID,
          roomPass: getRoomPass,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          const roomID = res.data.roomID;
          socket.emit("join", { room: roomID });
          router.push("/whiteboard");
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
        const errorMessage = (error.response?.data as { msg: string })?.msg;
        setError(errorMessage);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {error && <p className="text-red-500">{error}</p>}
      <JoinRoomForm handleRoomJoin={handleRoomJoin} />
      <CreateRoomForm handleCreateRoom={handleCreateRoom} />
    </div>
  );
}

export default App;

function JoinRoomForm({
  handleRoomJoin,
}: {
  handleRoomJoin: (event: FormEvent) => void;
}) {
  return (
    <div>
      <form
        onSubmit={handleRoomJoin}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          className="bg-slate-200 rounded-md"
          name="roomName"
          id="roomName"
          placeholder="Enter room name"
        />
        <input
          type="text"
          className="bg-slate-200 rounded-md"
          name="roomPass"
          id="RoomPass"
          placeholder="Enter room pass"
        />
        <button className="bg-red-500 rounded-md w-32 h-12 p-3">
          Join Room
        </button>
      </form>
    </div>
  );
}

function CreateRoomForm({
  handleCreateRoom,
}: {
  handleCreateRoom: (event: FormEvent) => void;
}) {
  return (
    <div>
      <form
        onSubmit={handleCreateRoom}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          className="bg-slate-200 rounded-md"
          name="createRoomID"
          id="createRoomID"
          placeholder="Enter room code"
        />

        <input
          type="text"
          className="bg-slate-200 rounded-md"
          name="roomPass"
          id="RoomPass"
          placeholder="Enter room pass"
        />
        <button className="bg-red-500 rounded-md w-32 h-12 p-3">
          Create Room
        </button>
      </form>
    </div>
  );
}
