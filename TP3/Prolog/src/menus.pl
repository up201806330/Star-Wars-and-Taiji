%:- [display].

% Displays the name of the game
% From: http://patorjk.com/software/taag/#p=testall&h=1&v=0&f=Dancing%20Font&t=Taiji
% Font Name: Ivrit
taiji_ascii :-
    nl, nl,
    horizontal_line,
    write(  '           _____       _   _  _    '), nl,
    write(  '          |_   _|__ _ (_) (_)(_)   '), nl,
    write(  '            | | / _` || | | || |   '), nl,
    write(  '            | || (_| || | | || |   '), nl,
    write(  '            |_| \\__,_||_|_/ ||_|  '), nl,
    write(  '                        |__/       '), nl,
    horizontal_line.


% Board size Menu
board_size_menu(GameState) :-
    write_board_size_menu,                          % Displays the menu
    write_user_insert_input,                        % Displays line where the user will write input
    get_char(Input), get_char(_),                   % Input Handling ("Switch")
    ( 
        (Input = '1' ; Input = '2' ; Input = '3') -> initial(Input, GameState);
    
    nl, write('Invalid Option'), nl,                % "Else statement"
    enter_to_continue, nl,
    clear_terminal, board_size_menu(GameState)
    ).




% Player vs Player / Player vs AI menu
mode_pvp_ai_menu(GameState) :-
    write_mode_pvp_ai_menu,                         % Displays the menu
    write_user_insert_input,                        % Displays line where the user will write input
    get_char(Input), get_char(_),                   % Input Handling ("Switch")
    (   Input = '1' -> selectGamemodeAndStart(GameState, pvp, 0);
        Input = '2' -> choose_ai_difficulty_menu(GameState, pve);
        Input = '3' -> choose_ai_difficulty_menu(GameState, eve);
    
    nl, write('Invalid Option'), nl,                % "Else statement"
    enter_to_continue, nl,
    clear_terminal, mode_pvp_ai_menu(GameState)
    ).


choose_ai_difficulty_menu(GameState, Mode) :-
    write_difficulty_ai_menu,
    write_user_insert_input,
    get_char(Input), get_char(_),                   % Input Handling ("Switch")
    (   Input = '1' -> selectGamemodeAndStart(GameState, Mode, 1);
        Input = '2' -> selectGamemodeAndStart(GameState, Mode, 2);
        Input = '3' -> selectGamemodeAndStart(GameState, Mode, 3);
    
    nl, write('Invalid Option'), nl,                % "Else statement"
    enter_to_continue, nl,
    clear_terminal, choose_ai_difficulty_menu(GameState, Mode)
    ).

restart_menu :-
    write('Go to Main Menu?'), nl,
    enter_to_continue, nl,
    clear_terminal, play.

    
    
    
   

                                                  
                                                  
                                                  

                                               
