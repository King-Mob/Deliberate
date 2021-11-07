import React, { useContext, useState, useEffect } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { MatrixContext } from "../context/MatrixContext";

const Draft = ({ user, colour }) => {
  const { client } = useContext(MatrixContext);
  const { draftProposalId } = useParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [createdProposalId, setCreatedProposalId] = useState();

  const loadProposal = async () => {
    const proposal = await client.getRoom(draftProposalId);
    await client.paginateEventTimeline(proposal.timelineSets[0].liveTimeline, {
      backwards: true,
    });

    proposal.timeline.forEach((event) => {
      const eventType = event.event.type;

      if (eventType === "m.proposal.draft") {
        setTitle(event.event.content.title);
        setText(event.event.content.text);
      }
      if (eventType === "m.proposal.created")
        setCreatedProposalId(draftProposalId);
    });
  };

  useEffect(() => {
    loadProposal();
  }, []);

  const createProposal = async () => {
    await client.sendEvent(draftProposalId, "m.proposal.created", {
      title,
      text,
      creator: {
        user,
        colour,
      },
    });
    // send the creation event to the room
    setCreatedProposalId(draftProposalId);
  };

  const saveDraft = async () => {
    await client.sendEvent(draftProposalId, "m.proposal.draft", {
      title,
      text,
    });
  };

  return (
    <div className="draft-container">
      <h1>drafting</h1>
      <div className="back-and-name-container">
        <Link to="../proposals">
          <p>back to proposals</p>
        </Link>
        <p>
          Drafting as <span style={{ color: colour }}>{user}</span>
        </p>
      </div>
      <div className="draft-text-container">
        <input
          type="text"
          value={title}
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          className="draft-title"
        ></input>
        <textarea
          type="text"
          value={text}
          placeholder="text"
          onChange={(e) => setText(e.target.value)}
          className="draft-text"
        ></textarea>
      </div>
      <div className="draft-buttons-container">
        <button onClick={saveDraft}>Save draft</button>
        <button onClick={createProposal}>Create Proposal</button>
      </div>
      {createdProposalId && (
        <Navigate to={`../deliberate/${createdProposalId}`} />
      )}
    </div>
  );
};

export default Draft;
