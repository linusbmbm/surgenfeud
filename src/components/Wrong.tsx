interface Props {
  visibility: boolean;
}

const Wrong = ({ visibility }: Props) => {
  if (!visibility) {
    return null;
  }

  return <div className={"wrong"}>X</div>;
};

export default Wrong;
