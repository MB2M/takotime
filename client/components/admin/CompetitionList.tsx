import { Divider, List, ListItem, ListItemButton } from "@mui/material";

const CompetitionList = ({ competitions }: { competitions: Competition[] }) => {
    return (
        <List>
            {competitions.map((competition) => (
                <>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href={`/admin/competition/${competition._id}`}
                        >
                            {competition.name}
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                </>
            ))}
        </List>
    );
};

export default CompetitionList;
