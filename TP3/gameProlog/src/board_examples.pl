
% Start State Board

initial_board('1', [
[clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear]
]).

initial_board('2', [
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear]
]).

initial_board('3', [
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear]
]).

% Intermediate State Board
intermediate_board([
[black,white,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,black,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,white,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,white,clear,clear,clear,clear],
[clear,clear,black,white,white,black,black,clear,clear,clear,clear],
[clear,black,black,white,white,black,black,white,clear,clear,clear],
[clear,white,clear,clear,black,clear,white,black,clear,clear,clear],
[clear,clear,clear,clear,white,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear],
[clear,clear,clear,clear,clear,clear,clear,clear,clear,clear,clear]
]).

% End State Board
end_board([
[black,white,white,white,black,white,clear,white,black,white,black],
[clear,black,black,black,black,white,white,black,clear,white,black],
[black,white,black,black,white,white,white,black,black,white,white],
[white,white,white,white,black,black,white,black,white,clear,black],
[white,black,black,white,white,black,black,black,white,black,white],
[black,black,black,white,white,black,black,white,clear,white,black],
[clear,white,white,black,black,clear,white,black,black,black,white],
[black,white,black,white,white,black,black,clear,white,black,white],
[black,white,clear,white,black,white,white,black,black,white,clear],
[black,white,white,black,black,black,white,white,black,black,white],
[clear,white,black,clear,white,clear,black,white,white,black,white]
]).