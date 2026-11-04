import { EC2Client, StartInstancesCommand } from "@aws-sdk/client-ec2";

// Initialize the EC2 client
const region = process.env.AWS_REGION || 'us-east-1';
const ec2Client = new EC2Client({ region: region });

export const handler = async (event) => {
    // Read the instance IDs from environment variables
    const instancesString = process.env.EC2_INSTANCES || "";
    
    if (!instancesString) {
        console.error("Error: EC2_INSTANCES environment variable is not defined or empty.");
        return { statusCode: 400, body: "Missing instance IDs" };
    }

    // Split by comma and clean up any accidental spaces around the IDs
    const instances = instancesString.split(",").map(id => id.trim());

    try {
        // Set up the parameters for the start command
        const command = new StartInstancesCommand({ InstanceIds: instances });
        
        // Execute the command
        const response = await ec2Client.send(command);
        
        console.log('Started instances:', instances);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Instances started successfully", instances })
        };
    } catch (error) {
        console.error("Error starting instances:", error);
        throw error;
    }
};
