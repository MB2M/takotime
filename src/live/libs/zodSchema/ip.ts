import { z } from "zod";

const ipSchema = z.string().regex(/^$|^192.168.3.1[0-9]{1,2}$/);

type Ip = z.infer<typeof ipSchema>;
