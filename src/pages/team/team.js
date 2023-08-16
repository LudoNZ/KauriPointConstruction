import "./team.css";
import { Link } from "react-router-dom";
//mugshot photos
import mugshotSimon from "../../assets/team/cropped_Simon.jpg";
import mugshotCam from "../../assets/team/cropped_Cam.jpg";
import mugshotIsaac from "../../assets/team/cropped_Isaac.jpg";
import postFoundations from "../../assets/team/postFoundations.JPG";
import defaultUser from "../../assets/icons/defaultProfile.png";
//Icons
import img_cost from "../../assets/icons/cost.png";
import img_quality from "../../assets/icons/quality.png";
import img_communication from "../../assets/icons/communication.png";
import img_planning from "../../assets/icons/planning.png";
import img_scheduling from "../../assets/icons/scheduling.png";
import img_teamWork from "../../assets/icons/teamWork.png";

export default function Team() {
  return (
    <div>
      <TeamPoster />
      <div className="mugShots">
        <ManagerCard />

        <TeamMemberCard
          name="Cam"
          position="Carpenter"
          mugshot={mugshotCam}
          text={CamCert()}
        ></TeamMemberCard>
        <TeamMemberCard
          name="Isaac"
          position="Apprentice"
          mugshot={mugshotIsaac}
          text={IsaacCert()}
        />
        <TeamMemberCard
          name="Dan"
          position="Builder"
          mugshot={defaultUser}
          text={DanCert()}
        />
      </div>
      <Attributes />
      <Brag />
    </div>
  );
}

const CamCert = () => {
  return (
    <>
      {" "}
      Foreman/ builder
      <br />
      National Cert. Carpentry
    </>
  );
};
const IsaacCert = () => {
  return <> Apprentice BCITO</>;
};
const DanCert = () => {
  return <>Builder</>;
};

function TeamPoster() {
  return (
    <div className="teamposter">
      <div className="teamposter-backingImage"></div>
      <div className="teamBackingImage"></div>
      <h1>Kauri Point Construction</h1>
      <p>
        With a team culture that revolves around leadership at all levels, we
        work together in a way that makes achieving maximum quality and
        efficiency our standard. We all bring individual skills and strengths to
        the team, there are no challenges we can’t overcome
      </p>
    </div>
  );
}

function ManagerCard() {
  return (
    <div className="managerCard">
      <div className="text">
        <h3>Director</h3>
        <h1>Simon Cattley</h1>
        <div className="greenLine"></div>
        <p>
          Project Manager <br />
          LBP
          <br />
          National Cert. Carpentry
          <br />
          Comprehensive First Aid
          <br />
          Height Safety/Fall Arrest Systems Cert.
          <br />
          Mapei Waterproofing Cert.
          <br />
        </p>
      </div>
      <img className="memberPhoto" src={mugshotSimon} alt="team member"></img>
    </div>
  );
}

function TeamMemberCard({ name, position, text, mugshot }) {
  return (
    <div className="teamMemberCard">
      <img className="memberPhoto" src={mugshot} alt="team member"></img>
      <div className="text">
        <h3>{position}</h3>
        <h1>{name}</h1>
        <div className="greenLine"></div>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Attributes() {
  return (
    <>
      <h2 className="attributesHeading">Kauri Point Construction</h2>
      <div className="attributes">
        <Attribute
          title="Cost"
          img={img_cost}
          text="Our efficiency and organization ensures we
                            can keep costs low and work within your budget"
        />
        <Attribute
          title="Quality"
          img={img_quality}
          text="We strive for perfection and refuse to compromise.
                            Our quality at all stages is at the highest level"
        />
        <Attribute
          title="Communication"
          img={img_communication}
          text="We aim to set ourselves apart by using clear communication to offer
                            complete transparency and build lasting relationships "
        />
        <Attribute
          title="Planning"
          img={img_planning}
          text="Our planning ensures we deliver your project on time and on budget"
        />
        <Attribute
          title="Scheduling"
          img={img_scheduling}
          text="Our detailed programme ensures that our amazing
                            network of subcontractors and suppliers work in seamlessly
                            with our construction plan"
        />
        <Attribute
          title="Team Work"
          img={img_teamWork}
          text="We form a great working relationship with everybody
                            involved in our projects. We like to maintain an enjoyable
                            environment on all of our sites "
        />
      </div>
    </>
  );
}

function Attribute({ title, text, img }) {
  return (
    <div className="attribute">
      <img src={img} alt="icon" className="circles"></img>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

function Brag() {
  return (
    <div className="brag">
      <img
        className="bragImage"
        src={postFoundations}
        alt="pouring foundations"
      ></img>
      <div className="bragText">
        <h1>
          If you can dream it, <br />
          we can build it
        </h1>
        <p>
          With a broad range of experience in all aspects of construction, we
          have the skills required to take on even the most challenging projects
        </p>
        <Link to="/contact">
          <div className="btn-white">
            Plan your project <br /> with us
          </div>
        </Link>
      </div>
    </div>
  );
}
