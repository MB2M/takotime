import type { NextPage } from "next";
import Image from "next/future/image";

const Home: NextPage = () => {
    return (
        <Image
            src={"/api/images/tako.png"}
            width={1000}
            style={{
                width: "100vmin",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
            }}
        />
    );
};

export default Home;
