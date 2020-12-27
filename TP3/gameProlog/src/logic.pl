% ----------------------------------------------------------------
% Start of game

% Determining at random whether the first or second playing entities get to be white
% (0 is Computer, 1 is Player1, 2 is Player2)
% PVP -> Player1 Vs Player2
random_white_number(pvp, White) :-
    random(1, 3, White).
% PVE -> Computer Vs Player1
random_white_number(pve, White) :-
    random(0, 2, White).
% EVE -> Computer Vs Computer
random_white_number(eve, White) :-
    White is 0.

% Chooses random entity to be white color and starts game on selected gamemode (PVP, PVE, EVE)
% selectGamemodeAndStart(+GameState, +Gamemode, +Level)
selectGamemodeAndStart(GameState, Gamemode, Level) :-
    random_white_number(Gamemode, WhiteEntity),
    turn(GameState, Gamemode, Level, WhiteEntity, white).

% Switches to next player, depends on game mode
% next_player(+Gamemode, +Player, -NextPlayer)
next_player(pvp, 1, 2).
next_player(pvp, 2, 1).
next_player(pve, 0, 1).
next_player(pve, 1, 0).
next_player(pvp, 0, 0).
next_player(eve, 0, 0).

% alternate_color(+Color, -NewColor)
alternate_color(white, black).
alternate_color(black, white).

% ----------------------------------------------------------------
% End of game 

% Reformatted version of game_over, returns list with [WhiteScore, BlackScore, WhoWhon]
% score_and_game_over(+GameState, -Output)
score_and_game_over(GameState, Output):-
    value(GameState, white, WhiteScore), value(GameState, black, BlackScore),

    valid_moves(GameState, _, Moves),
    length(Moves, Length),
    (
      Length =:= 0 -> % GameOver
        (
          WhiteScore > BlackScore  ->  
            WhoWhon = white 
            ; 
            WhoWhon = black
        )
        ;
        WhoWhon = none
    ), !, 
    Output = [WhiteScore, BlackScore, WhoWhon].


% Succeeds if no more plays can be made and returns the color that won, else fails
% game_over(+GameState, -Winner)
game_over(GameState, Winner) :-
    % Get and write scores for black and white pieces
    value(GameState, white, WhiteScore), value(GameState, black, BlackScore),
    nl, nl, write('White: '), write(WhiteScore), write(' | Black: '), write(BlackScore), nl, nl, 
    !,
  
    % Get valid moves list
    valid_moves(GameState, _, Moves),
    length(Moves, Length), !,
    Length =:= 0,
    (
      WhiteScore > BlackScore  ->  Winner = w; % White won
      WhiteScore =< BlackScore ->  Winner = b  % Black won
    ).

% Based on the final turn's player and color, returns correct winning player, unless its a draw, where it returns 3
% winning_player_from_color(+Gamemode, +CurrentPlayer, +CurrentColor, +WinningColor, -WinningPlayer)
winning_player_from_color(_, _, _, d, WinningPlayer):-
  WinningPlayer is 3.
winning_player_from_color(_, CurrentPlayer, WinningColor, WinningColor, WinningPlayer):-
  WinningPlayer is CurrentPlayer.
winning_player_from_color(Gamemode, CurrentPlayer, _, _ , WinningPlayer):-
  next_player(Gamemode, CurrentPlayer, WinningPlayer).

% ----------------------------------------------------------------
% Turn

% Chooses computer's move, based on difficulty level
% choose_move(+GameState, +Color, +Level, -Move)
choose_move(GameState, _, 1, Move):-
  valid_moves(GameState, _, Moves),
  length(Moves, L),
  random(0, L, MoveIndex),
  nth0(MoveIndex, Moves, Move).

choose_move(GameState, Color, 2, Move):-
  valid_moves(GameState, _, [MovesHead|MovesTail]),
  best_move(GameState, [MovesHead|MovesTail], Color, 0, MovesHead, Move).
  
choose_move(GameState, Color, 3, Move):-
  valid_moves(GameState, _, [MovesHead|MovesTail]),
  best_move(GameState, [MovesHead|MovesTail], Color, 0, 999, MovesHead, Move).
  
% Goes through list of moves and returns the one with the largest score for the computer.
% If it's being used in hardest difficulty, also checks in case of a draw, and returns the first move that minimizes the opponent score
% best_move(+GameState, +Moves, +Color, +MaxThisScore, +CurrBestMove, -BestMove)  <- Medium difficulty (Level 2)
best_move(_, [], _, _, CurrBestMove, BestMove):-
  BestMove = CurrBestMove.
best_move(GameState, [H|T], Color, MaxThisScore, CurrBestMove, BestMove):-
  move(GameState, H, NewGameState),
  value(NewGameState, Color, ThisScore),
  (
    ThisScore > MaxThisScore -> % Move maximizes computer score
      best_move(GameState, T, Color, ThisScore, H, BestMove) ; % Continues down valid moves list, saving new best move
      best_move(GameState, T, Color, MaxThisScore, CurrBestMove, BestMove) % Ignores this move
  ).

% best_move(+GameState, +Moves, +Color, +MaxThisScore, +MinOpponentScore, +CurrBestMove, -BestMove)  <- Hard difficulty (Level 3)
best_move(_, [], _, _, _, CurrBestMove, BestMove):-
  BestMove = CurrBestMove.
best_move(GameState, [H|T], Color, MaxThisScore, MinOpponentScore, CurrBestMove, BestMove):-
  move(GameState, H, NewGameState),
  value(NewGameState, Color, ThisScore),
  alternate_color(Color, OpponentColor),
  value(NewGameState, OpponentColor, OpponentScore),
  (
    (ThisScore > MaxThisScore ; % Move maximizes computer score
    (ThisScore =:= MaxThisScore,  OpponentScore < MinOpponentScore)) -> % Tie breaker, chooses move that minimizes opponent score
      best_move(GameState, T, Color, ThisScore, OpponentScore, H, BestMove) ; % Continues down valid moves list, saving new best move
      best_move(GameState, T, Color, MaxThisScore, MinOpponentScore, CurrBestMove, BestMove) % Ignores this move
  ).

% Initiates new turn with given GameState, Gamemode, Player and Color
% turn(+GameState, +Gamemode, +Level, +Player, +Color) 
turn(GameState, Gamemode, Level, Player, Color) :-
    clear_terminal,
    
    % Check if its game over, in which case it shows appropriate screen ; else continues with game
    (
      game_over(GameState, WinningColor) ->  
        winning_player_from_color(Gamemode, Player, Color, WinningColor, WinningPlayer), 
        display_game_over(GameState, WinningPlayer),
        restart_menu
        ; true
    ),

    % Display board and who is playing currently
    display_game(GameState, Player, Color),

    % Decide if input will be given by a player through keyboard or by the computer with choose_move
    (
      Player = 0 -> choose_move(GameState, Color, Level, ComputerMove), Move = ComputerMove;
      ( 
        % Get input from player to choose position of white piece of Taijitu
        length(GameState, L),
        input_position(InputRow, InputCol, L),
        (
            validate_position(InputRow, InputCol, L, ValidatedRow, ValidatedCol) -> true;

            nl, write('Invalid Taijitu position!'), nl,                % "Else statement"
            enter_to_continue, nl,
            turn(GameState, Gamemode, Level, Player, Color)
        ),

        % Get input from player to choose orientation of the taijitu
        input_orientation(Option),
        (
            validate_orientation(Option) -> true;

            nl, write('Invalid Taijitu orientation!'), nl,                % "Else statement"
            enter_to_continue, nl,
            turn(GameState, Gamemode, Level, Player, Color)
        ),

        % Get coords of black piece of Taijitu, according to chosen orientation
        black_move_part(ValidatedRow, ValidatedCol, Option, BlackRow, BlackCol),
        
        Move = [[ValidatedRow, ValidatedCol],[BlackRow, BlackCol]]
      )
    ),
  
    % play_piece(GameState, NewGameState),
    (
        move(GameState, Move, NewGameState) -> success_play(NewGameState, Gamemode, Level, Player, Color);
        
        nl, write('Cant place piece there!'), nl,                % "Else statement"
        enter_to_continue, nl,
        turn(GameState, Gamemode, Level, Player, Color)
    )
    .
turn(_,_,_,_,_):- write('\nExiting').

% Called if Move is valid, continues to next turn with new GameState
% success_play(+NewGameState, +Gamemode, +Level, +Player, +Color)
success_play(NewGameState, Gamemode, Level, Player, Color) :-
    nl, write('Success'), nl,
    enter_to_continue,
    next_player(Gamemode, Player, NewPlayer),
    alternate_color(Color, NewColor),
    nl, horizontal_line,
    turn(NewGameState, Gamemode, Level, NewPlayer, NewColor).

% Runs a move's changes on GameState i.e. places white and black pieces of new Taijitu on game board
% move(+GameState, +Move, -NewGameState)
move(GameState, [White|[Black|_]], NewGameState) :- 
  white_piece_move(GameState, White, NewGameState1), 
  black_piece_move(NewGameState1, Black, NewGameState).

white_piece_move(GameState, [Row | [Col|_]], NewGameState1) :-
  replace_(GameState, Row, Col, white, NewGameState1).

black_piece_move(NewGameState1, [Row | [Col|_]], NewGameState) :-
  replace_(NewGameState1, Row, Col, black, NewGameState).

% undo_move(+GameState, +Move, -NewGameState)
undo_move(GameState, [[WRow | [WCol|_]]|[[BRow | [BCol|_]]|_]], NewGameState):-
  replace_(GameState, WRow, WCol, clear, NewGameState1),
  replace_(NewGameState1, BRow, BCol, clear, NewGameState).
  
% ----------------------------------------------------------------

% Returns coordinates of black piece of Taijitu, according to chosen orientation
% black_move_part(+Row, +Col, +Option, -BlackRow, -BlackCol)
black_move_part(Row, Col, '1', Row, BlackCol) :- % black on the right
    %write('\nBlack on Right\n'),
    BlackCol is Col + 1.

black_move_part(Row, Col, '2', Row, BlackCol) :- % black on the left
    %write('\nBlack on Left\n'),
    BlackCol is Col - 1.

black_move_part(Row, Col, '3', BlackRow, Col) :- % black on the bottom
    %write('\nBlack on Bottom\n'),
    BlackRow is Row + 1.

black_move_part(Row, Col, '4', BlackRow, Col) :- % black on the top
    %write('\nBlack on Top\n'),
    BlackRow is Row - 1.

% ----------------------------------------------------------------
% Converts row and col chars to their corresponding indexes
convert_input_row('a', 0).
convert_input_row('b', 1).
convert_input_row('c', 2).
convert_input_row('d', 3).
convert_input_row('e', 4).
convert_input_row('f', 5).
convert_input_row('g', 6).
convert_input_row('h', 7).
convert_input_row('i', 8).
convert_input_row('j', 9).
convert_input_row('k', 10).
convert_input_row('A', 0).
convert_input_row('B', 1).
convert_input_row('C', 2).
convert_input_row('D', 3).
convert_input_row('E', 4).
convert_input_row('F', 5).
convert_input_row('G', 6).
convert_input_row('H', 7).
convert_input_row('I', 8).
convert_input_row('J', 9).
convert_input_row('K', 10).

convert_input_col('0', 0).
convert_input_col('1', 1).
convert_input_col('2', 2).
convert_input_col('3', 3).
convert_input_col('4', 4).
convert_input_col('5', 5).
convert_input_col('6', 6).
convert_input_col('7', 7).
convert_input_col('8', 8).
convert_input_col('9', 9).
convert_input_col('X', 10).
% ----------------------------------------------------------------
% Input

% Gets coordinates of white piece of the Taijitu from the user
% input_position(-InputRow, -InputCol, +L)
input_position(InputRow, InputCol, L) :-
    write('White Piece Row ( A - '), LastRowIndex is 64 + L, write_char(LastRowIndex), write('): '), get_char(InputRow), get_char(_), nl,
    write('White Piece Col ( 0 - '), LastColIndex is 47 + L, write_char(LastColIndex), write('): '), get_char(InputCol), get_char(_), nl.

% Checks if inputted row and column are valid values and are inside bounds, returning the values converted to indexes in range [0, 10]
% validate_position(+InputRow, +InputCol, +L, -ConvertedRow, -ConvertedCol)
validate_position(InputRow, InputCol, L, ConvertedRow, ConvertedCol) :-
    convert_input_row(InputRow, ConvertedRow),
    convert_input_col(InputCol, ConvertedCol),
    ConvertedRow >= 0, ConvertedRow < L,
    ConvertedCol >= 0, ConvertedCol < L.

% Checks if inputted orientation is a valid value
% validate_orientation(Option)
validate_orientation('1').
validate_orientation('2').
validate_orientation('3').
validate_orientation('4').

% Gets the option of the orientation of the Taijitu from the user
% input_orientation(-Option)
input_orientation(Option) :-
    show_orientations, nl,
    get_char(Option), get_char(_).

% ----------------------------------------------------------------
% Score

% dfs(+GameState, +Color, +ToVisit,+ VisitedIn, +DepthIn, -VisitedOut, -DepthOut)
%% Done, all visited 
dfs(_, _, [], VisitedIn, DepthIn, VisitedOut, DepthOut):-
    (DepthIn \= 1 -> DepthOut is DepthIn ; DepthOut is 0), 
    append([], VisitedIn, VisitedOut),
    !.
%% If has already been visited, skips
dfs(GameState, Color, [H|T], VisitedIn, DepthIn, VisitedOut, DepthOut) :-
    member(H,VisitedIn),
    dfs(GameState, Color, T, VisitedIn, DepthIn, VisitedOut, DepthOut).
%% If isn't correct color, skips and adds to visited
dfs(GameState, Color, [H|T], VisitedIn, DepthIn, VisitedOut, DepthOut) :-
    color(GameState, H, C), 
    C \= Color,
    dfs(GameState, Color, T, [H|VisitedIn], DepthIn, VisitedOut, DepthOut).
%% Add all neigbors of the head to the toVisit
dfs(GameState, Color, [H|T], VisitedIn, DepthIn, VisitedOut, DepthOut) :-
    length(GameState, L),
    findall((X, Y), adjacent((H), (X,Y), L), Nbs),
    addToList(Nbs,T, ToVisit),
    NewDepthIn is DepthIn + 1,
    dfs(GameState, Color, ToVisit, [H|VisitedIn], NewDepthIn, VisitedOut, DepthOut).

% algorithm(+GameState, +Color, +ToVisit, +Values, +VisitedIn, -Value)
algorithm(GameState, _, [], Values, _, Value):-
    length(GameState, L),
    get_scoring_type(L, ScoringType),
    samsort(Values, SortedValues),
    reverse(SortedValues, ReversedValues),
    trim(ReversedValues, ScoringType, ActualValues),
    (list_sum(ActualValues, Value) -> true ; Value = 0).
algorithm(GameState, Color, [H|T], Values, VisitedIn, Value):-
    dfs(GameState, Color, [H], VisitedIn, 0, VisitedOut, X),
    (X \= 0 -> append(Values, [X], NewValues) ; NewValues = Values),
    algorithm(GameState, Color, T, NewValues, VisitedOut, Value).

% Returns scoring type to be used, according to the length of the gamestate array
% get_scoring_type(+L, -ScoringType)
get_scoring_type(7, 1).
get_scoring_type(9, 2).
get_scoring_type(11,3).
get_scoring_type(_, 1).

% Returns lists with all indexes of square arrays of length L
% indexes_from_length(+L -Output)
indexes_from_length(L,Output):-
   (L =:= 3 -> append([], [(0,0),(0,1),(0,2),(1,0),(1,1),(1,2),(2,0),(2,1),(2,2)], Output);
    L =:= 7 -> append([], [(0,0),(0,1),(0,2),(0,3),(0,4),(0,5),(0,6),(1,0),(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(2,0),(2, 1),(2,2),(2,3),(2,4),(2,5),(2,6),(3,0),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(4,0),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(5,0),(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(6,0),(6,1),(6,2),(6,3),(6,4),(6,5),(6,6)], Output);
    L =:= 9 -> append([], [(0,0),(0,1),(0,2),(0,3),(0,4),(0,5),(0,6),(0,7),(0,8),(1,0),(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(2,0),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(3,0),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(4,0),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),(5,0),(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(6,0),(6,1),(6,2),(6,3),(6,4),(6,5),(6,6),(6,7),(6,8),(7,0),(7,1),(7,2),(7,3),(7,4),(7,5),(7,6),(7,7),(7,8),(8,0),(8,1),(8,2),(8,3),(8,4),(8,5),(8,6),(8,7),(8,8)], Output);
    L =:= 11 -> append([], [(0,0),(0,1),(0,2),(0,3),(0,4),(0,5),(0,6),(0,7),(0,8),(0,9),(0,10),(1,0),(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(2,0),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(3,0),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,9),(3,10),(4,0),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),(4,9),(4,10),(5,0),(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(5,9),(5,10),(6,0),(6,1),(6,2),(6,3),(6,4),(6,5),(6,6),(6,7),(6,8),(6,9),(6,10),(7,0),(7,1),(7,2),(7,3),(7,4),(7,5),(7,6),(7,7),(7,8),(7,9),(7,10),(8,0),(8,1),(8,2),(8,3),(8,4),(8,5),(8,6),(8,7),(8,8),(8,9),(8,10),(9,0),(9,1),(9,2),(9,3),(9,4),(9,5),(9,6),(9,7),(9,8),(9,9),(9,10),(10,0),(10,1),(10,2),(10,3),(10,4),(10,5),(10,6),(10,7),(10,8),(10,9),(10,10)], Output);
    fail
   ).

% value(+GameState, +Color, -Value) 
value(GameState, Color, Value) :-
    length(GameState, L),
    indexes_from_length(L, ToVisit),
    algorithm(GameState, Color, ToVisit, [], [], Value).


% ----------------------------------------------------------------

% Returns List of Possible Moves
% valid_moves(+GameState, +Player, -ListOfMoves)
valid_moves(GameState, Player, ListOfMoves) :-
    nth0(0, GameState, Row),
    length(Row, NumCols),
    length(GameState,NumRows),
    iterateBoard(GameState, NumRows, NumCols, Player, ListOfMoves).

% Iterates over the board matrix and returns the list of valid moves
% iterateBoard(+GameState, +NumRows, +NumCols, +Player, -ValidMoves)
iterateBoard(GameState, NumRows, NumCols, Player, ValidMoves):-
    iterateBoard(GameState,GameState, 0, NumRows, 0, NumCols, Player, [], ValidMoves).

iterateBoard(_, [], NumRows, NumRows, 0, _, _, ValidMoves, ValidMoves).
iterateBoard(GameState, [H|T], NumRow, NumRows, 0, NumCols, Player, Acc, ValidMoves) :-
    searchMove(GameState, H, NumRow, 0, NumRows, NumCols, Player, CurrFound),
    append(Acc, CurrFound, NewMovesList),
    NewNumRow is NumRow + 1,
    iterateBoard(GameState, T, NewNumRow, NumRows, 0, NumCols, Player, NewMovesList, ValidMoves).

% Iterates over a given row
% searchMove(+GameState, +List, +NumRow, +NumCol, +NumRows, +NumCols, +Player, -CurrFound)
searchMove(GameState, List, NumRow, NumCol, NumRows, NumCols, Player, CurrFound) :-
    searchMove(GameState, List, NumRow, NumCol, NumRows, NumCols, Player, [], CurrFound).

searchMove(_, [], _, NumCols, _, NumCols, _, CurrFound, CurrFound).
searchMove(GameState, [Head|Tail], NumRow, NumCol, NumRows, NumCols, Player, ValidMove, CurrFound) :-
    (
        compare(=, Head, 'clear'),
        checkAdjacents(GameState, NumRow, NumCol, NumRows, NumCols, AdjacentMoves),
        length(AdjacentMoves, AdjacentMovesLength),

        checkDiffZeroLength(ValidMove, AdjacentMoves, AdjacentMovesLength, NewMovesList),

        NewNumCol is NumCol+1,
        searchMove(GameState, Tail, NumRow, NewNumCol, NumRows, NumCols,Player, NewMovesList, CurrFound)
    )
    ;
    (
        NewNumCol is NumCol+1,
        searchMove(GameState, Tail, NumRow, NewNumCol, NumRows, NumCols, Player, ValidMove, CurrFound)
    ).

% Checks for a clear adjacent cell
% checkAdjacents(+GameState, +NumRow, +NumCol, +NumRows, +NumCols, -AdjacentMoves)
checkAdjacents(GameState, NumRow, NumCol, NumRows, NumCols, AdjacentMoves) :-
    checkDown(GameState, NumRow, NumCol, NumRows, MoveDown),
    checkUp(GameState, NumRow, NumCol, MoveUp),
    checkRight(GameState, NumRow, NumCol, NumCols, MoveRight),
    checkLeft(GameState, NumRow, NumCol, MoveLeft),

    % Down
    length(MoveDown, LengthMoveDown), 
    checkDiffZeroLength(NumCol,NumRow, MoveDown, LengthMoveDown, CellMovesDown),

    length(CellMovesDown, LengthCellMovesDown),
    checkDiffZeroLength([], [CellMovesDown], LengthCellMovesDown, L),

    % Up
    length(MoveUp, LengthMoveUp),
    checkDiffZeroLength(NumCol,NumRow, MoveUp, LengthMoveUp, CellMovesUp),

    length(CellMovesUp, LengthCellMovesUp),
    checkDiffZeroLength(L, [CellMovesUp], LengthCellMovesUp, L1),

    % Right
    length(MoveRight, LengthMoveRight), 
    checkDiffZeroLength(NumCol,NumRow, MoveRight, LengthMoveRight, CellMovesRight),

    length(CellMovesRight, LengthCellMovesRight),
    checkDiffZeroLength(L1, [CellMovesRight], LengthCellMovesRight, L2),

    % Left
    length(MoveLeft, LengthMoveLeft), 
    checkDiffZeroLength(NumCol,NumRow, MoveLeft, LengthMoveLeft, CellMovesLeft),

    length(CellMovesLeft, LengthCellMovesLeft),
    checkDiffZeroLength(L2, [CellMovesLeft], LengthCellMovesLeft, CellMoves),


    append([], CellMoves, AdjacentMoves).


% checkDown(+GameState, +NumRow, +NumCol, +NumRows, -MoveDown)
checkDown(GameState,NumRow, NumCol, NumRows, MoveDown):-
    NumRow \= NumRows - 1, NewNumRow is NumRow+1,
    nth0(NewNumRow, GameState, BoardRow),
    nth0(NumCol, BoardRow, Content),
    
    compare(=, Content, 'clear'),
    Move = [[NewNumRow, NumCol]],
    append([], Move, MoveDown).

checkDown(_, _, _, _, []).

% checkUp(+GameState, +NumRow, +NumCol, -MoveUp)
checkUp(GameState, NumRow, NumCol, MoveUp) :-
    NumRow \= 0, NewNumRow is NumRow-1,
    nth0(NewNumRow, GameState, BoardRow),
    nth0(NumCol, BoardRow, Content),

    compare(=, Content, 'clear'),
    Move = [[NewNumRow, NumCol]],
    append([], Move, MoveUp).

checkUp(_, _, _, []).

% checkRight(+GameState, +NumRow, +NumCol, +NumCols, -MoveRight)
checkRight(GameState, NumRow, NumCol, NumCols, MoveRight) :-
    NumCol \= NumCols - 1, NewNumCol is NumCol+1,
    nth0(NumRow, GameState, BoardRow),
    nth0(NewNumCol, BoardRow, Content),

    compare(=, Content, 'clear'),
    Move = [[NumRow, NewNumCol]],
    append([], Move, MoveRight).

checkRight(_, _, _, _, []).

% checkLeft(+GameState, +NumRow, +NumCol, -MoveLeft)
checkLeft(GameState, NumRow, NumCol, MoveLeft) :-
    NumCol \= 0, NewNumCol is NumCol-1,
    nth0(NumRow, GameState, BoardRow),
    nth0(NewNumCol, BoardRow, Content),

    compare(=, Content, 'clear'),
    Move = [[NumRow, NewNumCol]],
    append([], Move, MoveLeft).

checkLeft(_, _, _, []).