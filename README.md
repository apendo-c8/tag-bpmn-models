### Description

Streamline the tagging of Camunda BPMN process models to align them with specific model milestones by leveraging the Camunda Web Modeler API with this GitHub Action. 
This action is part of a suite of actions designed to streamline the CI/CD pipeline for managing BPMN process models.

### Usage

To use this action in your workflow, follow these steps:

**Set Up Camunda API Access:**

   Ensure you have correct credentials to authorize the [Camunda Modeler API](https://docs.camunda.io/docs/next/apis-tools/web-modeler-api/)

You can simply refer to this GitHub action in any GitHub workflow.:

   ```yaml
         - name: Tag BPMN Models
           uses: apendo-c8/download-bpmn-models-action@v1
           with:
             source: 'Project Id'
             tag: 'Tag name (${{ github.ref_name }} will reference the latest pushed tag or branch)'
             client_id: 'Camunda Modeler API Client ID'   
             client_secret: 'Camunda Modeler API Client Secret'
