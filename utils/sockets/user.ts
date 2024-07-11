interface user{
    auth: string;
    userID: string
    sessions: [
         sessionName: {
            sessionID: string,
            title: string,
            status: number

        }
    ]
}