% Consulting Files / Modules
:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module(library(samsort)).
:- [logic, menus, display, board_examples, utils].

% Main Predicate
play :-
    taiji_ascii, nl, nl,
    board_size_menu(GameState), nl,
    mode_pvp_ai_menu(GameState).


