import RatingRadioGroup from "./RatingRadioGroup";

function ItemRow({ item, scale, answer, onAnswerChange }) {
  return (
    <div className="item-row">
      <div className="item-text">
        {item.text}
      </div>

      <div className="answer-group answer-self">
        <RatingRadioGroup
          itemId={item.id}
          group="self"
          scale={scale}
          selectedValue={answer?.self}
          onChange={onAnswerChange}
        />
      </div>

      <div className="answer-group answer-others">
        <RatingRadioGroup
          itemId={item.id}
          group="others"
          scale={scale}
          selectedValue={answer?.others}
          onChange={onAnswerChange}
        />
      </div>
    </div>
  );
}

export default ItemRow;