horizontal_line :-
    write(  '-------------------------------------------'), nl.

write_user_insert_input :-
    write('     :- '). 

enter_to_continue:-
	write('Press Enter to continue.'), nl,
	write_user_insert_input, get_char(_), nl, write('Leaving'), nl, !.

% Source: https://swi-prolog.discourse.group/t/useful-command-to-clear-the-console/976
clear_terminal :-
    write('\e[H\e[2J').

% Sums all elements inside List
list_sum([Item], Item).
list_sum([Item1,Item2 | Tail], Total) :-
    NewItem is Item1+Item2,
    list_sum([NewItem|Tail], Total).


% Trim List L to length N
trim(L,N,S) :-
    length(L,X),
    (
        N =< X ->
        PL is X - N,
        length(P,PL), 
        append(S,P,L);
        append([], L, S)
    ).

replace_( [L|Ls] , 0 , Y , Z , [R|Ls] ) :-      % once we find the desired row,
  replace_column(L,Y,Z,R)                       % - we replace specified column, and we're done.
  .                                             %
replace_( [L|Ls] , X , Y , Z , [L|Rs] ) :-      % if we haven't found the desired row yet
  X > 0 ,                                       % - and the row offset is positive,
  X1 is X-1 ,                                   % - we decrement the row offset
  replace_( Ls , X1 , Y , Z , Rs )              % - and recurse down
  .                                             %

replace_column( [COld|Cs] , 0 , Z , [Z|Cs] ).
    %compare(=, COld, 'clear').                 % <--- checks if clear
                                                % once we find the specified offset, just make the substitution and finish up.
replace_column( [C|Cs] , Y , Z , [C|Rs] ) :-    % otherwise,
  Y > 0 ,                                       % - assuming that the column offset is positive,
  Y1 is Y-1 ,                                   % - we decrement it
  replace_column( Cs , Y1 , Z , Rs )            % - and recurse down.
  .


% Gets element at (I, J) coordinates of a matrix
% color(+Matrix, +(I, J), -Color)
color(Matrix, (I, J), Color) :-
    nth0(I, Matrix, Row),
    nth0(J, Row, Color).

% Returns all combinations of adjacent coordinates ; Checks bounds with L
% adjacent(+(X,Y), -(X, Yy), +L)
adjacent((X,Y), (X, Yy), L) :-
   (
    Yy is min(Y + 1, L - 1) 
   ; 
    Yy is max(Y - 1, 0)
    ),
    dif((X, Y), (X, Yy)).
adjacent((X,Y), (Xx, Y), L) :-
   (
    Xx is min(X + 1, L - 1)
   ;
    Xx is max(X - 1, 0)
    ),
    dif((X, Y), (Xx, Y)).

remove_list([], _, []).
remove_list([X|Tail], L2, Result):- member(X, L2), !, remove_list(Tail, L2, Result). 
remove_list([X|Tail], L2, [X|Result]):- remove_list(Tail, L2, Result).

atl(_, [], []).
atl(List, [H|T], R) :-
    (  member(H, List)
    -> R = Res
    ;  R = [H|Res]
    ),
    atl(List, T, Res).

% Removes elements in B from A and returns in L
% addToList(+A, +B, -L)
addToList(A, B, L) :-
    atl(A, B, R),
    append(A, R, L).

checkDiffZeroLength(_, _, _, 0, []).
checkDiffZeroLength(NumCol,NumRow, List, 1, NewList) :- append([[NumRow, NumCol]], List, NewList).

checkDiffZeroLength(InputList1, _, 0, InputList1).
checkDiffZeroLength(InputList1, InputList2, _, NewList) :- append(InputList1, InputList2, NewList).