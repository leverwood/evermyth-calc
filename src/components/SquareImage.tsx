interface SquareImageProps {
  url: string;
}

function SquareImage({ url }: SquareImageProps) {
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "whitesmoke",
        width: "100%",
        aspectRatio: "1 / 1",
      }}
    />
  );
}

export default SquareImage;
