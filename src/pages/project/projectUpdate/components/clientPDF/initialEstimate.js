import PDF_Creator from "../../../../../components/PDF_Creator";
import "./initialEstimate.css";

export default function InitialEstimate({ project }) {
  const Header = () => {
    const KPCInfo = () => {
      return (
        <div className="KPCInfo">
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
          <Info label={"Date"} data={"yy mmm dd"} />
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
      const data = [
        {
          description: "Bathroom",
          quantity: 1.0,
          unitPrice: 7983.78,
          amount: 7983.78,
        },
        {
          description: "Toilet",
          quantity: 1.0,
          unitPrice: 3122.84,
          amount: 3122.84,
        },
        {
          description: "Lounge/ Dining",
          quantity: 1.0,
          unitPrice: 19278.21,
          amount: 19278.21,
        },
        {
          description: "Master Bedroom",
          quantity: 1.0,
          unitPrice: 8842.78,
          amount: 8842.78,
        },
        {
          description: "Kitchen",
          quantity: 1.0,
          unitPrice: 24538.18,
          amount: 24538.18,
        },
        {
          description: "Garage",
          quantity: 1.0,
          unitPrice: 9937.62,
          amount: 9937.62,
        },
        {
          description: "Bedroom 2",
          quantity: 1.0,
          unitPrice: 9916.0,
          amount: 9916.0,
        },
        {
          description: "Bedroom 3",
          quantity: 1.0,
          unitPrice: 9916.0,
          amount: 9916.0,
        },
        {
          description: "Entry",
          quantity: 1.0,
          unitPrice: 5024.99,
          amount: 5024.99,
        },
        {
          description: "Exterior",
          quantity: 1.0,
          unitPrice: 9948.0,
          amount: 9948.0,
        },
        {
          description: "Engineer (PC SUM)",
          quantity: 1.0,
          unitPrice: 8000.0,
          amount: 8000.0,
        },
        {
          description: "P&G",
          quantity: 1.0,
          unitPrice: 9320.67,
          amount: 9320.67,
        },
        {
          description: "Margin",
          quantity: 1.0,
          unitPrice: 12582.91,
          amount: 12582.91,
        },

        { description: "TOTAL NZD", amount: 159173.79 },
      ];
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
            {Object.entries(data).map(([index, item]) => (
              <tr key={index}>
                <td className="description">{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
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

  return (
    <PDF_Creator>
      <Header />
      <Content />
    </PDF_Creator>
  );
}
