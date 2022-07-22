import { Button, Container } from "@mui/material";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import Rounds from "../../../../components/tounament/Rounds";
import RoundsModal from "../../../../components/tounament/RoundsModal";

const Tournament = ({ tournament }: { tournament: Tournament }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleAddRound = async (round: Round) => {
        if (!round) return;

        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tournament._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        rounds: [...tournament.rounds, round],
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setModalOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditRound = async (round: Round) => {
        if (!round) return;

        const newRoundList = tournament.rounds.map((r) => {
            if (r._id !== round._id) {
                return r;
            }

            return round;
        });

        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tournament._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        rounds: newRoundList,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setModalOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleRemoveRound = async (roundId: string | undefined) => {
        if (!roundId) return;

        const newRoundList = tournament.rounds.filter((r) => r._id !== roundId);

        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tournament._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        rounds: newRoundList,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    if (!tournament) return <h3>BAD TOURNAMENT ID</h3>;

    return (
        <Container>
            <RoundsModal
                open={modalOpen}
                onSave={handleAddRound}
                onClose={handleModalClose}
            ></RoundsModal>

            <p>{`Tournament ${tournament.name} with id ${tournament._id}`}</p>

            <Button variant="outlined" onClick={() => setModalOpen(true)}>
                Add new Round
            </Button>
            <h3>Round List</h3>
            <Rounds
                rounds={tournament.rounds.sort()}
                onRemoveRound={handleRemoveRound}
                onEditRound={handleEditRound}
            />
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tid }: any = context.params;

    if (!tid) return { props: { tournament: null } };

    try {
        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tid}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.ok) {
            const tournament: Tournament = await response.json();
            return { props: { tournament } };
        } else {
            return { props: { tournament: null } };
        }
    } catch (err) {
        console.log(err);
        return { props: { tournament: null } };
    }
};

export default Tournament;
