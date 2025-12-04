function Button({ name, buttonFunction }) {
  return (
    <button
      className="border-1 bg-black rounded-4xl p-4 w-[40%] lg:w-[20%] border-gray-600 font-bold justify-center items-center"
      onClick={buttonFunction}
    >
      {name}
    </button>
  );
}

export default Button;
