import { useFirestore } from "../../../../../hooks/useFirestore";
import PDF_Creator from "../../../../../components/PDF_Creator";
import "./initialEstimate.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import logo from "../../../../../assets/logo.png";

import {
  calculateProjectProgress,
  calculateStageProgress,
} from "../../../../../components/progressBar/ProgressBar";
import { numberWithCommas } from "../../../ProjectFinancialInfo";

import Collapsible from "react-collapsible";
import { useState } from "react";

export default function InitialEstimate({ project }) {
  const { updateDocument, response } = useFirestore("projects");

  const handleSubmitQuote = async () => {
    const quotes = project.quotes || {};
    let newQuoteCount = Object.keys(quotes).length + 1;
    quotes[newQuoteCount] = {
      mainList: project.mainList,
      labourList: project.labourList,
    };

    const updateProject = {
      quotes: quotes,
    };
    await updateDocument(project.id, updateProject);
  };

  function generateUniqueId(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let uniqueId = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }
    return uniqueId;
  }

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
      const currentDate = new Date();
      const futureDate = new Date(currentDate);
      futureDate.setDate(futureDate.getDate() + 30);

      const [selectedDate, setSelectedDate] = useState({
        date: currentDate,
        expiry: futureDate,
      });

      const handleDateChange = (date) => {
        setSelectedDate({ ...selectedDate, date: date });
      };
      const handleExpiryChange = (date) => {
        setSelectedDate({ ...selectedDate, expiry: date });
      };

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
            data={
              <DatePicker
                selected={selectedDate.date} // Set this to the selected date
                dateFormat="dd MMM yy"
                onChange={(date) => handleDateChange(date)} // Implement handleDateChange function
              />
            }
          />

          <Info
            label={"Expiry"}
            data={
              <DatePicker
                selected={selectedDate.expiry} // Set this to the selected date
                dateFormat="dd MMM yy"
                onChange={(date) => handleExpiryChange(date)} // Implement handleDateChange function
              />
            }
          />
          <Info label={"Quote Number"} data={generateUniqueId(8)} />
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

  const Submit = () => {
    return (
      <div className="btn" onClick={handleSubmitQuote}>
        Submit
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
      <Submit />
    </div>
  );
}
