## EZ-EC

EZ-EC (Easy Embodied Carbon) is a web application that can be used by AEC professionals to get quick estimates of embodied carbon performance of building designs in early project phases. As a user, you provide details about the land lot, massing geometry, structural system and façade. As a response, you get the GWPs (Global Warming Potentials) of the different components of the building (façade, floor, columns etc.), including a visualization of the geometry. The hope is that this tool can be used to make informed decisions in early stages, as the structural system and the cladding make up roughly 70% of the embodied carbon of a building. To be able to meet the goals of the Paris agreement, it’s about time that we as an industry start to take action.

## Context 
EZ-EC was developed during the AEC Tech 2020 hackathon by the following team:

- Andrew Swartzell (Pickard Chilton)
- Luke Gehron (Payette)
- Patryk Wozniczka (Entuitive)
- Brittney Holmes (HMC Architects)
- Chris Hazel (Ayers Saint Gross Architects)
- Luke Lombardi (Thornton Tomasetti)
- Emil Poulsen (Thornton Tomasetti) 

This project won the prize for “Best Overall Hack”.

![The Swarm portion of EZ-EC](img/EZEC_Swarm_Demo.gif)

## Tech stack
On a technical note, the backend of EZ-EC is powered by a carefully crafted Grasshopper3d script hosted on Swarm. It utilizes the amazing open source work by the BHoM team to retrieve relevant material data for the GWP estimates. The Grasshopper script can be found in this Github repo. To make EC-EZ even more powerful, we incorporated the Swarm app in a custom built Vue app, allowing you to upload a Rhino file to get even more granular breakdowns of the EC performance as a second step. This part completes the workflow nicely when the specifics of massing geometry start to emerge. Check out a video of the full demo here](https://youtu.be/nmZqXmnFkFA)
