import { Button, Container } from "@mui/material";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Rounds from "../../../../components/tounament/Rounds";
import RoundsModal from "../../../../components/tounament/RoundsModal";
import {
    getTournament,
    updateTournament,
} from "../../../../utils/fetchTournament";

// const Tournament = ({ tournament }: { tournament: Tournament }) => {
const Tournament = () => {
    const [tournament, setTournament] = useState<Tournament | null>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const retrieveTournament = async () => {
        const { tid }: any = router.query;
        const tournament = await getTournament(tid);

        if (tournament) {
            setTournament(tournament);
        }
    };

    useEffect(() => {
        retrieveTournament();
    }, []);

    const update = async (payload: Object) => {
        if (!tournament) return;

        console.log(update);

        await updateTournament(tournament._id, payload);

        setModalOpen(false);

        retrieveTournament();
    };

    const handleAddRound = async (round: Round) => {
        if (!round) return;
        if (!tournament) return;

        const payload = {
            rounds: [...tournament.rounds, round],
        };

        update(payload);
        setModalOpen(false);
    };

    const handleEditRound = async (round: Round) => {
        if (!round) return;
        if (!tournament) return;

        const newRoundList = tournament.rounds.map((r) => {
            if (r._id !== round._id) {
                return r;
            }

            return round;
        });

        const payload = {
            rounds: newRoundList,
        };

        update(payload);
        setModalOpen(false);
    };

    const handleRemoveRound = async (roundId: string | undefined) => {
        if (!roundId) return;
        if (!tournament) return;

        const newRoundList = tournament.rounds.filter((r) => r._id !== roundId);
        const payload = {
            rounds: newRoundList,
        };

        update(payload);
        setModalOpen(false);
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

    const tournament = await getTournament(tid);

    if (tournament) {
        return { props: { tournament } };
    } else {
        return { props: { tournament: null } };
    }
    // try {
    //     const response = await fetch(
    //         `http://${process.env.NEXT_PUBLIC_LIVE_API}/wod1/tournaments/${tid}`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         }
    //     );

    //     if (response.ok) {
    //         const tournament: Tournament = await response.json();
    //         return { props: { tournament } };
    //     } else {
    //         return { props: { tournament: null } };
    //     }
    // } catch (err) {
    //     console.log(err);
    //     return { props: { tournament: null } };
    // }
};

export default Tournament;
