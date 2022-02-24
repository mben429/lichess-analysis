export const checkUserColor = (curr_game, username) => {
    if (curr_game.players.black.user.name == username) {
        return "black";
    }
    else {
        return "white";
    }
}

// Get player ratings
export const getUserRating = (curr_game, player, username) => {

    if (checkUserColor(curr_game, username) == "black") {
        if (player == "user"){
            return curr_game.players.black.rating + curr_game.players.black.ratingDiff;
        }
        else if (player == "opp"){
            return curr_game.players.white.rating + curr_game.players.white.ratingDiff;
        }
    }

    else {
        if (player == "user"){
            return curr_game.players.white.rating + curr_game.players.white.ratingDiff;
        }
        else if (player == "opp"){
            return curr_game.players.black.rating + curr_game.players.black.ratingDiff;
        }
    }
}

export const getGameType = (curr_game) => {
    return curr_game.speed;
}



export const getLabelEloProg = () => {
    let label_arr = [];
    for (let i = 1; i <= 100; i+=1){
        label_arr.push(i);
    }
    return label_arr;
}   

export const getEloDiffs = (elo_arr) => {
    let bullet_diff = elo_arr[0][elo_arr[0].length-1] - elo_arr[0][0];
    let blitz_diff =  elo_arr[1][elo_arr[1].length-1] - elo_arr[1][0];
    let rapid_diff = elo_arr[2][elo_arr[2].length-1] - elo_arr[2][0];
    let classical_diff = elo_arr[3][elo_arr[3].length-1] - elo_arr[3][0];

    let diff_arr = [bullet_diff, blitz_diff, rapid_diff, classical_diff];

    return diff_arr;
}

export const averageArr = (arr) => {
    let ret_sum = 0;
    for (let i = 0; i <arr.length; i++){
        ret_sum += arr[i];
    }
    return Math.floor(ret_sum / arr.length);
}

export const getRatingAvg = (elo_arr) => {
    let rating_avg_arr = [averageArr(elo_arr[0]), averageArr(elo_arr[1]), averageArr(elo_arr[2]), averageArr(elo_arr[3])];
    return rating_avg_arr;
}

export const getDictVals = (count_dict, count_dict_op_top5) => {
    let count_dict_freq_top5 = [];
    for (let i = 0; i < count_dict_op_top5.length; i++) {
        count_dict_freq_top5.push(count_dict[count_dict_op_top5[i]]);
    }
    return count_dict_freq_top5;
}

export const getOpeningsCounts = (openings_arr) => {
    let count_dict = {}

    for (let opening of openings_arr) {
        if (count_dict[opening]) {
            count_dict[opening] += 1;
        }
        else {
            count_dict[opening] = 1;
        }
    }

    let count_dict_op_top5 = Object.keys(count_dict);
    let count_dict_freq_top5 = getDictVals(count_dict, count_dict_op_top5);



    return [count_dict_op_top5, count_dict_freq_top5];

}

