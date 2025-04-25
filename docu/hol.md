# AI Cockpit - Human on the loop

<img src="doc/chemistree_logo.svg" alt="Chemistree Logo" align="left" style="width:80px;float: left"/> In this field lab we developed a software solution assisting those who are assigned the role of “human oversight” under the AI Act to effectively monitor and control an AI system.

The Software in this field lab was developed by [Chemistree GmbH](https://www.chemistree.de/).

## AI Cockpit Features

The AI Cockpit core is a web-based application, which allows users:

* to specify and describe modules of an existing AI-system
* to associate several levels of autonomy of an module
* to create risks for the AI-System or specific modules
* to create measures in order to measure and monitor the risks, like key performance indicators
* to have an oversight about all measures at a single cockpit dashboard
* to change the level of autonomy of single modules
* to press a Stopp-Button, which navigates the AI-System in defined levels of autonomy
* to communication with the AI-System through an API

The AI Cockpit followed an generic approach, so it can be used by all industrial sectors, not only by human ressources, where it was originally developed for.

For more technical details have a look at our GitHub-Repository of the [AI Cockpit Human on the Loop](https://github.com/chmstr/ai-cockpit)

## AI-Cockpit API (KIC-API)

The AI Cockpit is communicating with a backend for persisting data. But the AI cockpit can as well directly communicate with the AI-System itself, if the AI-System implements the given
[AI-Cockpit API](https://github.com/chmstr/ai-cockpit/blob/main/api/kic-api-v1.0.0.yaml)
which defines the basic usecases for automatic configuration and control. The functionaly of the API covers the following usecases:

* Set the active level of autonomy for a specific module of an AI-System
* Get the active level of autonomy of a module
* List all levels of autonomy of an AI module
* List all details incl. autonomylevels of a module
* List all modules with all details incl. autonomylevels
* Get labels and datasets of an key performance indicator

### Open Source

The developed solution is open source and uses mainly two other open source projects:

* [Vue.js](https://vuejs.org/): an open-source JavaScript framework specifically designed for building user interfaces (UIs) and single-page applications (SPAs).
* [Appwrite](https://appwrite.io/): an open-source self-hosted Backend-as-a-Service (BaaS) platform, used for Authentication, Databases, Functions, Storage, and Messaging.
  
The AI Cockpit of Chemistree is 100% open source and published under AGPL.

## Human on the loop

<img src="doc/chemistree_logo.svg" alt="Chemistree Logo" align="left" style="width:180px;float: left; margin-right: 10px;"/> In this section you will find the AI Cockpit "Human on the Loop", which was developed assisting those who are assigned the role of “human oversight” under the AI Act to effectively monitor and control an AI system. It follows a risk based and generic approach.

The Features and Usecases for this AI Cockpit Human on the Loop are desrcibed [here](hol.md).

Software in this section was developed by [Chemistree GmbH](https://www.cheminstree.de/)
