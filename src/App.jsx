import assessmentList from "./data/assessment-list.json";
import AssessmentListForm from "./components/AssessmentListForm";

function App() {
  return <AssessmentListForm assessmentList={assessmentList} />;
}

export default App;