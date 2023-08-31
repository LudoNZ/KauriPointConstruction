import PDF_Creator from "../../../../../components/PDF_Creator";
import "./initialEstimate.css";

import logo from "../../../../../assets/logo.png";

import {
  calculateProjectProgress,
  calculateStageProgress,
} from "../../../../../components/progressBar/ProgressBar";
import { numberWithCommas } from "../../../ProjectFinancialInfo";

import Collapsible from "react-collapsible";

export default function InitialEstimate({ project }) {
  const Header = () => {
    const KPCInfo = () => {
      return (
        <div className="KPCInfo">
          <img src={logo} alt="KPC logo" className="form-logo" />

          <p>Kauri Point Construction Ltd</p>
          <p>771 South Titirangi Road</p>
          <p>Titirangi</p>
          <p> 0604</p>
          <p>Auckland</p>
          <p>NEW ZEALAND</p>
        </div>
      );
    };
    const StampInfo = () => {
      const Info = ({ label, data }) => {
        return (
          <div className="Info">
            <h5>{label}</h5>
            <p>{data}</p>
          </div>
        );
      };
      return (
        <div className="StampInfo">
          <Info
            label={"Date"}
            data={new Date().toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })}
          />

          <Info label={"Expiry"} data={"yy mmm dd"} />
          <Info label={"Quote Number"} data={"#UNIQUE_ID"} />
        </div>
      );
    };

    return (
      <div className="Header">
        <div>
          <h1>Estimate</h1>
          <div className="clientName">{project.clientName}</div>
        </div>
        <div className="stamp">
          <StampInfo />
          <KPCInfo />
        </div>
      </div>
    );
  };

  const Content = () => {
    const Table = () => {
      const mainList = [...project.mainList];
      const projectFinancials = calculateProjectProgress(project);
      const totalCost = numberWithCommas(projectFinancials.totalCost);
      const totalCostIncGST = numberWithCommas(
        projectFinancials.totalCost * 1.15
      );
      const StageRow = ({ stage }) => {
        const stageFinancials = calculateStageProgress(
          stage,
          project.subContractFee
        );
        const stageCost = numberWithCommas(stageFinancials.totalCost);
        const stageCostIncGST = numberWithCommas(
          stageFinancials.totalCost * 1.15
        );
        const TaskRow = ({ task }) => {
          const unitPrice = numberWithCommas(task.calculatedamount);
          const incGST = numberWithCommas(task.calculatedamount * 1.15);
          return (
            <tr key={task.code} className="sub-task">
              <td className="description">{task.task}</td>
              <td>{unitPrice}</td>
              <td>{incGST}</td>
            </tr>
          );
        };

        return (
          <Collapsible
            trigger={
              <tr key={stage.name}>
                <td className="description cursorHover">{stage.name}</td>
                <td>{stageCost}</td>
                <td>{stageCostIncGST}</td>
              </tr>
            }
          >
            <div className="table-tasks">
              {stage.tasks.map((task) => (
                <TaskRow task={task} />
              ))}
            </div>
          </Collapsible>
        );
      };
      return (
        <div className="table">
          <thead>
            <tr>
              <th className="description">Description</th>
              <th>Unit Price</th>
              <th>including GST</th>
            </tr>
          </thead>
          <div>
            {mainList.map((stage) => (
              <StageRow stage={stage} />
            ))}
            <tr className="totalRow">
              <td className="description">Total</td>
              <td>{totalCost}</td>
              <td>
                <strong>{totalCostIncGST}</strong>
              </td>
            </tr>
          </div>
        </div>
      );
    };

    return (
      <div className="Content">
        <h2 className="address">{project.address.line1}</h2>
        <p>This quote.....</p>
        <Table />
      </div>
    );
  };
  const Terms = () => {
    return (
      <div className="terms">
        <h5>Terms</h5>
        <p>This invoice is claimed under the Construction Contracts Act 2015</p>
      </div>
    );
  };

  return (
    <div className="pdfForm">
      <PDF_Creator>
        <Header />
        <Content />
        <Terms />
      </PDF_Creator>
    </div>
  );
}
