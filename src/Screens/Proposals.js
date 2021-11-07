import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { MatrixContext } from "../context/MatrixContext";

const Proposals = ({ user, colour }) => {
  const { client } = useContext(MatrixContext);
  const [drafts, setDrafts] = useState([]);
  const [deliberations, setDeliberations] = useState([]);
  const [passedProposals, setPassedProposals] = useState([]);

  const [proposalsLoading, setProposalsLoading] = useState(true);
  const [newProposalId, setNewProposalID] = useState();

  const sortProposal = async (proposal) => {
    await client.paginateEventTimeline(proposal.timelineSets[0].liveTimeline, {
      backwards: true,
    });

    let created = false;
    let passed = false;
    let withdrawn = false;

    proposal.timeline.forEach((event) => {
      const eventType = event.event.type;

      if (eventType === "m.proposal.draft") {
        proposal.title = event.event.content.title;
      }
      if (eventType === "m.proposal.created") {
        created = true;
        proposal.title = event.event.content.title;
      }
      if (eventType === "m.proposal.passed") {
        passed = true;
      }
      if (eventType === "m.proposal.withdrawn") {
        withdrawn = true;
      }
    });

    if (!created)
      if (!drafts.includes(proposal)) setDrafts(drafts.concat([proposal]));
    if (created && !passed && !withdrawn)
      if (!deliberations.includes(proposal))
        setDeliberations(deliberations.concat([proposal]));
    if (passed)
      if (!passedProposals.includes(proposal))
        setPassedProposals(passedProposals.concat([proposal]));
  };

  const loadProposals = async () => {
    if (client) {
      const rooms = client.getRooms();

      for (const room of rooms) {
        if (room.name === "deliberate-proposal") await sortProposal(room);
      }

      setProposalsLoading(false);
    }
  };

  useEffect(() => {
    if (proposalsLoading) loadProposals();
  });

  const createProposal = async () => {
    const newProposal = await client.createRoom({
      visibility: "private",
      name: "deliberate-proposal",
    });

    setNewProposalID(newProposal.room_id);
  };

  return (
    <div className="login-container">
      <h1>{process.env.REACT_APP_GROUP_NAME} Proposals</h1>
      <p>
        Logged in as <span style={{ color: colour }}>{user}</span>
      </p>
      <button disabled={!client} onClick={createProposal}>
        New Proposal
      </button>
      {newProposalId && <Navigate to={`../draft/${newProposalId}`} />}
      <div className="proposal-columns-container">
        <div>
          <h2>Drafts</h2>
          {drafts.map((proposal) => (
            <Link to={`../draft/${proposal.roomId}`} key={proposal.roomId}>
              <div>{proposal.title ? proposal.title : proposal.roomId}</div>
            </Link>
          ))}
        </div>
        <div>
          <h2>Deliberations</h2>
          {deliberations.map((proposal) => (
            <Link to={`../deliberate/${proposal.roomId}`} key={proposal.roomId}>
              <div>{proposal.title ? proposal.title : proposal.roomId}</div>
            </Link>
          ))}
        </div>
        <div>
          <h2>Passed</h2>
          {passedProposals.map((proposal) => (
            <div>{proposal.title ? proposal.title : proposal.roomId}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Proposals;
