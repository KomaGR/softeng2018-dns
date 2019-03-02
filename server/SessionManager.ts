import {v4 as uuidv4} from 'uuid';
import {User} from "./models/UserModel";

type Data = {
    token: string,
    username: string,
    role: string
};

export default class SessionManager {

    // Maybe use hashmap later (https://www.npmjs.com/package/hashmap, https://www.npmjs.com/package/@types/hashmap)
    private session_list;
        
    constructor() {
        this.session_list = {};
    }

    public NewSession(user: User): string {
        let rand_tok = uuidv4();
        let session_data: Data = {
            token: rand_tok, 
            username: user.username, 
            role: user.role
        };

        console.log(rand_tok);
        
        this.session_list[rand_tok] = session_data;

        return rand_tok;
    }

    public CheckSession(tok: string) {
        let check: Data = this.session_list[tok];
        if (check) {
            return check;
        } else {
            return 'none'
        }
    }

    public EndSession(tok: string) {
        return delete this.session_list[tok];
    }

    // Mocking Sessions
    
    public NewSessionMock(): string {
        let rand_tok = uuidv4();
        let session_data: Data = {
            token: rand_tok,
            username: "KomaGR",
            role: "admin"
        };

        console.log(rand_tok);

        this.session_list[rand_tok] = session_data;

        return rand_tok;
    }

    public CheckSessionMock(tok: string) {
        let check: Data = this.session_list[tok];
        if (check) {
            return check;
        } else {
            return 'none'
        }
    }

    public EndSessionMock(tok: string) {
        return delete this.session_list[tok];
    }
}
