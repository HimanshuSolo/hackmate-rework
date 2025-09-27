import { Tweet } from "react-tweet";

interface TwitterEmbedProps {
  tweetId: string;
  className?: string;
}

export const TwitterEmbed: React.FC<TwitterEmbedProps> = ({ tweetId, className }) => {
  return (
    <div data-theme="dark" className={`w-full max-w-sm mx-auto ${className}`}>
      <Tweet id={tweetId} />
    </div>
  );
};

export default TwitterEmbed;
