import { EC2Client, StopInstancesCommand } from "@aws-sdk/client-ec2";

// Initialize the EC2 client
const region = process.env.AWS_REGION || 'ap-southeast-1';
const ec2Client = new EC2Client({ region: region });

export const handler = async (event) => {
    // Read and split the instance IDs from environment variables
    const instancesString = process.env.EC2_INSTANCES || "";
    
    if (!instancesString) {
        console.error("Error: EC2_INSTANCES environment variable is not defined or empty.");
        return { statusCode: 400, body: "Missing instance IDs" };
    }

    const instances = instancesString.split(",");

    try {
        // Set up the parameters for the stop command
        const command = new StopInstancesCommand({ InstanceIds: instances });
        
        // Execute the command
        const response = await ec2Client.send(command);
        
        console.log('Stopped instances:', instances);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Instances stopped successfully", instances })
        };
    } catch (error) {
        console.error("Error stopping instances:", error);
        throw error;
    }
};
