import React from "react";

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
import { useEffect, useState } from "react";
import FormText from "../../../../../components/forms/formText";

export default function InitialEstimate({ project }) {
  const { updateDocument, response } = useFirestore("projects");
  const [comment, setComment] = useState("");
  const [uniqueID, setUniqueID] = useState("");

  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(futureDate.getDate() + 30);

  const [selectedDate, setSelectedDate] = useState({
    date: currentDate,
    expiry: futureDate,
  });

  useEffect(() => {
    setUniqueID(generateUniqueId(8));
  }, []);

  const handleSubmitQuote = async () => {
    const quotes = project.quotes || {};
    let newQuoteCount = Object.keys(quotes).length + 1;
    quotes[newQuoteCount] = {
      comment: comment,
      mainList: project.mainList,
      labourList: project.labourList,
      dates: selectedDate,
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
            <div>{data}</div>
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
          <Info label={"Quote Number"} data={uniqueID} />
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
    const stageFinancials = calculateStageProgress(
      stage,
      project.subContractFee
    );
    const stageCost = numberWithCommas(stageFinancials.totalCost);
    const stageCostIncGST = numberWithCommas(stageFinancials.totalCost * 1.15);

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

  const Table = () => {
    const mainList = [...project.mainList];
    const projectFinancials = calculateProjectProgress(project);
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

  const Content = () => {
    const [isEditMode, setIsEditMode] = useState(false);

    const stopEditing = () => {
      setIsEditMode(false);
      console.log("stopping editing");
    };

    return (
      <div className="Content">
        <h2 className="address">{project.address.line1}</h2>
        {isEditMode ? (
          <FormText
            text={comment}
            placeholder="quote text..."
            updateText={setComment}
            onUpdate={stopEditing}
          />
        ) : (
          <div onClick={() => setIsEditMode(true)} className="ch">
            {comment || "CLICK TO CHANGE TEXT......"}
          </div>
        )}
        <div style={{ height: "100px" }} />
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
