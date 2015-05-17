Started as a way of laying out "quantity cards" for teaching my baby math...
The Book I was reading said to lay out red dots on cards, 1 dot, 2 dots, 3 dots, ... 100 dots.
I thought "I don't have time to do that, but I have time to write a program to do it!"

The algorithm works by keeping an array of dots, and an associated array of trajectories.
Then, for every update, each dot moves a little bit, and new trajectories are computed.

There are 'forces' provided by being close to other dots, being outside the bounding box,
and being outside a bounding circle, which all combine to compute any given trajectory.

When all dots stay relatively still, we call it good, and stop the update loop.

1. Download the code, and open the 'spread-out.html' file in a browser
2. Use query parameters to specify how many dots n are to be laid out, e.g. 

spred-out.html?n=48