function RatingRadioGroup({
  itemId,
  group,
  scale,
  selectedValue,
  onChange
}) {
  const groupName = `${itemId}-${group}`;

  return (
    <div className="rating-radio-group">
      {scale.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <label
            key={option.value}
            className="radio-label"
            aria-label={option.label}
            title={option.label}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(itemId, group, option.value)}
            />

            <span
              className={[
                "custom-radio",
                `color-${option.color}`,
                isSelected ? "selected" : ""
              ].join(" ")}
            />
          </label>
        );
      })}
    </div>
  );
}

export default RatingRadioGroup;