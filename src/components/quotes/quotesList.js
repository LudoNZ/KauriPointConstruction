import Collapsible from "react-collapsible";
import { numberWithCommas } from "../../pages/project/ProjectFinancialInfo";
import { calculateStageProgress } from "../progressBar/ProgressBar";

export default function QuotesList({ project, projectFee }) {
  return (
    <div className="quotes">
      <h3>History:</h3>

      {project.quotes && (
        <>
          {Object.values(project.quotes).map((quote) => (
            <Estimate
              quote={quote}
              projectFee={projectFee}
              key={quote.uniqueID}
            />
          ))}
        </>
      )}
    </div>
  );
}

function Estimate({ quote, projectFee }) {
  const Content = () => {
    const TaskRow = ({ task }) => {
      const unitPrice = numberWithCommas(task.calculatedamount);
      const incGST = numberWithCommas(task.calculatedamount * 1.15);
      return (
        <div key={task.code} className="sub-task flex-spaceBetween">
          <span className="description">{task.task}</span>
          <span>{unitPrice}</span>
          <span>{incGST}</span>
        </div>
      );
    };

    const StageRow = ({ stage }) => {
      const stageFinancials = calculateStageProgress(stage, projectFee);
      const stageCost = numberWithCommas(stageFinancials.totalCost);
      const stageCostIncGST = numberWithCommas(
        stageFinancials.totalCost * 1.15
      );

      return (
        <Collapsible
          className="stage"
          open={true}
          transitionTime={100}
          trigger={
            <div key={stage.name} className="flex-spaceBetween stageRow">
              <span className="description cursorHover flex-spaceBetween">
                {stage.name}
              </span>
              <span>{stageCost}</span>
              <span>{stageCostIncGST}</span>
            </div>
          }
        >
          <div className="stageTasks">
            {stage.tasks.map((task, k) => (
              <TaskRow task={task} key={k} />
            ))}
          </div>
        </Collapsible>
      );
    };

    const Table = ({ project }) => {
      const mainList = [...project.mainList];
      const projectFinancials = calculateQuoteProgress(project, projectFee);
      const totalCost = numberWithCommas(projectFinancials.totalCost);
      const totalCostIncGST = numberWithCommas(
        projectFinancials.totalCost * 1.15
      );
      return (
        <div className="table">
          <div className="topRow">
            <div className="flex-spaceBetween">
              <span className="description">Description</span>
              <span>Unit Price</span>
              <span>including GST</span>
            </div>
          </div>
          <div>
            {mainList.map((stage) => (
              <StageRow stage={stage} key={stage.name} />
            ))}
            <div className="totalRow flex-spaceBetween">
              <span className="description">Total</span>
              <span>{totalCost}</span>
              <span>
                <strong>{totalCostIncGST}</strong>
              </span>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="Content">
        <div style={{ padding: "4em 0 1em 0" }}>
          <div>ID: {quote.uniqueID}</div>
          <div>{quote.type}</div>
          <div>{quote.comment}</div>
          <div>created: {quote.dates.date.toDate().toLocaleDateString()} </div>
          expires: {quote.dates.expiry.toDate().toLocaleDateString()}
        </div>
        <Table project={quote} />
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <Content />
    </div>
  );
}

const calculateQuoteProgress = (project, projectFee) => {
  let totalClaimed = 0;
  let totalCost = 0;
  let totalNextClaim = 0;
  project.mainList.forEach((stage) => {
    const stageSums = calculateStageProgress(stage, projectFee);
    console.log("SS:", stageSums);
    totalClaimed += stageSums.totalClaimed;
    totalCost += stageSums.totalCost;
    totalNextClaim += stageSums.totalNextClaim;
  });
  return {
    totalClaimed: totalClaimed,
    totalCost: totalCost,
    totalNextClaim: totalNextClaim,
  };
};
