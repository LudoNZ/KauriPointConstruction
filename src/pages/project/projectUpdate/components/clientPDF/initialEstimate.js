import PDF_Creator from "../../../../../components/PDF_Creator";
import "./initialEstimate.css";

import logo from "../../../../../assets/logo.png";

import {
  calculateProjectProgress,
  calculateStageProgress,
} from "../../../../../components/progressBar/ProgressBar";
import { numberWithCommas } from "../../../ProjectFinancialInfo";

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
          <Info label={"Quote Number"} data={"?required"} />
          <Info label={"GST Number"} data={"?required"} />
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
      console.log("MMAINLIST:", mainList);

      const projectFinancials = calculateProjectProgress(project);
      const totalCost = numberWithCommas(projectFinancials.totalCost);
      return (
        <table className="table">
          <thead>
            <tr>
              <th className="description">Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount NZD</th>
            </tr>
          </thead>
          <tbody>
            {mainList.map((stage) => {
              console.log("STAGE:", stage);

              const stageFinancials = calculateStageProgress(
                stage,
                project.subContractFee
              );
              const stageCost = numberWithCommas(stageFinancials.totalCost);

              return (
                <tr key={stage.name}>
                  <td className="description">{stage.name}</td>
                  <td>{stage.quantity}</td>
                  <td>{stage.unitPrice}</td>
                  <td>{stageCost}</td>
                </tr>
              );
            })}
            <tr>
              <td className="description">Total</td>
              <td>{}</td>
              <td>{}</td>
              <td>
                <strong>{totalCost}</strong>
              </td>
            </tr>
          </tbody>
        </table>
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
