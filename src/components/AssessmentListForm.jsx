import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Legend from "./Legend";
import CategorySection from "./CategorySection";

function AssessmentListForm({ assessmentList }) {
  const [answers, setAnswers] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  function handleAnswerChange(itemId, group, value) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [itemId]: {
        ...previousAnswers[itemId],
        [group]: value
      }
    }));
  }

  function getAllItems() {
    return assessmentList.categories.flatMap((category) => category.items);
  }

  function getUnansweredItems() {
    return getAllItems().filter((item) => {
      const answer = answers[item.id];

      return !answer?.self || !answer?.others;
    });
  }

  function createFileName() {
    const now = new Date();

    const datePart = now.toISOString().slice(0, 10);
    const timePart = now
      .toTimeString()
      .slice(0, 8)
      .replaceAll(":", "-");

    const safeTitle = assessmentList.title
      .toLowerCase()
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ü", "ue")
      .replaceAll("ß", "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `${safeTitle || "bewertungsliste"}-${datePart}-${timePart}.pdf`;
  }

async function handleOpenPdf(event) {
  event.preventDefault();

  const unansweredItems = getUnansweredItems();

  if (unansweredItems.length > 0) {
    const shouldOpenPdf = window.confirm(
      "You have not answerd all questions.\n" +
      "Do you still want to open the PDF?"
    );

    if (!shouldOpenPdf) {
      return;
    }
  }

  const exportElement = exportRef.current;

  if (!exportElement) {
    alert("Die PDF konnte nicht erstellt werden, weil der Exportbereich nicht gefunden wurde.");
    return;
  }

  try {
    setIsExporting(true);

    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    const canvas = await html2canvas(exportElement, {
      scale: 2,
      backgroundColor: "#f8fafc",
      useCORS: true
    });

    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;

    let remainingHeight = imageHeight;
    let imagePositionY = 0;

    pdf.addImage(imageData, "PNG", 0, imagePositionY, imageWidth, imageHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      imagePositionY -= pageHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, imagePositionY, imageWidth, imageHeight);
      remainingHeight -= pageHeight;
    }

    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Fehler beim PDF-Export:", error);
    alert("Beim Erstellen der PDF ist ein Fehler aufgetreten.");
  } finally {
    setIsExporting(false);
  }
}

  return (
    <main className="page" ref={exportRef}>
      <Legend scale={assessmentList.scale} />

      <form
        className={`assessment-card ${isExporting ? "is-exporting" : ""}`}
        onSubmit={handleOpenPdf}
      >
        <div className="assessment-header">
          <h1>{assessmentList.title}</h1>

          <div className="assessment-column-label assessment-column-self">
            With Yourself
          </div>

          <div className="assessment-column-label assessment-column-others">
            With others
          </div>
        </div>

        <div className="assessment-table">
          {assessmentList.categories.map((category) => (
            <CategorySection
              key={category.name}
              category={category}
              scale={assessmentList.scale}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        <div className="submit-area">
          <button className="submit-button" type="submit" disabled={isExporting}>
            {isExporting ? "PDF is build" : "open PDF"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AssessmentListForm;