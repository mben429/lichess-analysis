    // Elo Rating Data and chart data (CD) for Elo progression line chart
    const [eloProgChartData, setEloProgChartData] = useState();

    // Get player ratings
    const getUserRating = (username, players_data, player) => {
    
        if (players_data.black.user.name == username) {
            if (player == "user"){
                return players_data.black.rating + players_data.black.ratingDiff;
            }
            else if (player == "opp"){
                return players_data.white.rating + players_data.white.ratingDiff;
            }
        }

        else {
            if (player == "user"){
                return players_data.white.rating + players_data.white.ratingDiff;
            }
            else if (player == "opp"){
                return players_data.black.rating + players_data.black.ratingDiff;
            }
        }
    }

    const getGameType = (curr_game) => {
        return curr_game.speed;
    }

    // Retrieve elo array for bullet, blitz, classical and rapid
    async function getEloRatingArray(username, game_data) {
        const myPromise = new Promise((resolve, reject) => {
            let elo_2d_arr = [];
            let elo_arr_bullet = [], elo_arr_blitz = [], elo_arr_rapid = [], elo_arr_classical = [];
            let curr_game;

            for (let i = 0; i < game_data.length; i++) {
                
                curr_game = game_data[i];

                if (getGameType(curr_game) == 'bullet') {
                    elo_arr_bullet.push(getUserRating(username, curr_game.players, "user"));
                }
                else if (getGameType(curr_game) == 'blitz') {
                    elo_arr_blitz.push(getUserRating(username, curr_game.players, "user"));
                }
                else if (getGameType(curr_game) == 'rapid') {
                    elo_arr_rapid.push(getUserRating(username, curr_game.players, "user"));
                }
                else if (getGameType(curr_game) == 'classical') {
                    elo_arr_classical.push(getUserRating(username, curr_game.players, "user"));
                }
            }
            elo_2d_arr.push(elo_arr_bullet, elo_arr_blitz, elo_arr_rapid, elo_arr_classical);
            resolve(elo_2d_arr);
        })

    }
    
    // Getters will get data needed for charts
    async function getEloArray(){
        const elo_array = await getEloRatingArray(username, game_data);
        console.log("inside getEloArray: ", elo_array);
        
        return elo_array
    }

    // useEffect() will set the state of datavars ready for chart usage
    useEffect(() => {
    
        async function setEloProgData () {
            // Set Elo Rating var for chart
            let elo_obj = await getEloArray();
            console.log("Inside elo_obj", elo_obj);

            let bullet_elo_arr = elo_obj[0].reverse(), blitz_elo_arr = elo_obj[1].reverse(), rapid_elo_arr = elo_obj[2].reverse(), classical_elo_arr = elo_obj[3].reverse();            

            console.log("bullet",bullet_elo_arr);
            console.log("blitz",blitz_elo_arr);
            console.log("rapid",rapid_elo_arr);
            console.log("classical",classical_elo_arr);

            setEloProgChartData({
                labels: [0, 20, 40, 60, 80, 100],
                datasets: [
                    {
                        label: 'bullet (< 3 min)',
                        data: bullet_elo_arr,
                        borderColor: "rgb(78, 193, 193)"
                    },
                    {
                        label: 'bltz (< 8 min)',
                        data: blitz_elo_arr,
                        borderColor: "rgb(255, 203, 40)"
                    },
                    {
                        label: 'rapid (< 25 min)',
                        data: rapid_elo_arr,
                        borderColor: "rgb(153, 152, 153)"
                    },
                    {
                        label: 'classical (< 360 min)',
                        data: classical_elo_arr,
                        borderColor: 'rgb(249, 1, 64)'
                    }
                ]
            })
        }
        setEloProgData();
        console.log("eloProgCHART DATA:", eloProgChartData);
    }, []);
