import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MatrixContext } from "../context/MatrixContext";

const Deliberate = ({ user, colour }) => {
  const { client } = useContext(MatrixContext);
  const { proposalId } = useParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [proposerName, setProposerName] = useState("");
  const [proposerColour, setProposerColour] = useState("");

  const loadProposal = async () => {
    const proposal = await client.getRoom(proposalId);
    await client.paginateEventTimeline(proposal.timelineSets[0].liveTimeline, {
      backwards: true,
    });

    proposal.timeline.forEach((event) => {
      const eventType = event.event.type;

      if (eventType === "m.proposal.created") {
        setProposerName(event.event.content.creator.user);
        setProposerColour(event.event.content.creator.colour);
        setTitle(event.event.content.title);
        const textWithLineBreaks = event.event.content.text.split("\n");
        setText(textWithLineBreaks);
      }
    });

    console.log(proposal);
  };

  useEffect(() => {
    loadProposal();
  }, []);

  return (
    <div className="draft-container">
      <h1>deliberating</h1>
      <div className="back-and-name-container">
        <Link to="../proposals">
          <p>back to proposals</p>
        </Link>
        <p>
          Deliberating as <span style={{ color: colour }}>{user}</span>
        </p>
      </div>
      <div className="deliberate-proposal-container">
        <h2 className="deliberate-title">{title}</h2>
        <h3 className="deliberate-proposer">
          Proposed by{" "}
          <span style={{ color: proposerColour }}>{proposerName}</span>
        </h3>
        {text &&
          text.map((line) => (
            <p key={line} className="proposal-line">
              {line}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Deliberate;
