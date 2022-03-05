import XButton from "./XButton";

interface Props {
  displayText: string;
}

export default function ({ displayText }: Props) {
  return (
    <div>
      <button className="btn btn-secondary rounded-full gap-1">
        {displayText}
        <XButton />
      </button>
    </div>
  );
}
