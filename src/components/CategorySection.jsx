import ItemRow from "./ItemRow";

function CategorySection({ category, scale, answers, onAnswerChange }) {
  return (
    <section className="category-section">
      <div className="category-title">
        {category.name}
      </div>

      {category.items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          scale={scale}
          answer={answers[item.id]}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </section>
  );
}

export default CategorySection;