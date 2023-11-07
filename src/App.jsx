import { useState } from "react";
import axios from "axios";

const App = () => {
  const [content, setContent] = useState("");
  const [resList, setResList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitChat = async (e) => {
    try {
      e.preventDefault();

      if (!content) return;

      setIsLoading(true);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
          },
        }
      );

      setIsLoading(false);

      if (response.status !== 200) return;

      setResList([...resList, response.data.choices[0].message.content]);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-start items-center pt-16"
      onSubmit={onSubmitChat}
    >
      <form className="flex max-w-screen-md w-full ">
        <input
          className={`grow border-2 border-pink-200 rounded-lg focus:outline-pink-400 px-2 py-1 text-lg ${
            isLoading && "bg-gray-300 border-gray-500"
          }`}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무엇이든 물어보세요. Chat-GPT"
          disabled={isLoading}
        />
        <input
          className={`ml-4 px-2 py-1 rounded-lg text-gray-50 w-28 ${
            isLoading ? "bg-gray-400" : "bg-pink-400"
          }`}
          type="submit"
          value={isLoading ? "로딩중" : "검 색"}
          disabled={isLoading}
        />
      </form>
      <ul className="p-20 flex flex-col gap-12">
        {resList.map((v, i) => {
          return (
            <li key={i}>
              {i + 1}. {v}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
