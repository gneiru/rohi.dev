import { EmbeddedTweet, TweetNotFound, type TweetProps } from "react-tweet";
import { getTweet } from "react-tweet/api";

const TweetContent = async ({ id, components, onError }: TweetProps) => {
  let error = undefined;
  const tweet = id
    ? await getTweet(id).catch((err) => {
        if (onError) {
          error = onError(err);
        } else {
          console.error(err);
          error = err;
        }
      })
    : undefined;

  if (!tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound error={error} />;
  }

  return <EmbeddedTweet tweet={tweet} components={components} />;
};

export const ReactTweet = (props: TweetProps) => <TweetContent {...props} />;
