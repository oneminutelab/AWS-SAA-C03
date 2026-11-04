import { EC2Client, StartInstancesCommand } from "@aws-sdk/client-ec2";

// Initialize the EC2 client
const region = process.env.AWS_REGION || 'us-east-1';
const ec2Client = new EC2Client({ region: region });

export const handler = async (event) => {
    // Print the incoming event details
    console.log("Received event:", JSON.stringify(event));

    try {
        // Extract the instance ID from the EventBridge event detail structure
        const instanceId = event?.detail?.['instance-id'];

        if (!instanceId) {
            console.error("Error: 'instance-id' not found in event payload.");
            return { statusCode: 400, body: "Missing instance-id in event payload" };
        }

        const instances = [instanceId];

        // Set up the parameters for the start command
        const command = new StartInstancesCommand({ InstanceIds: instances });
        
        // Execute the command
        await ec2Client.send(command);
        
        console.log(`Protected instance stopped - starting up instance: ${instances}`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Protected instance auto-restart triggered", instances })
        };
    } catch (error) {
        console.error("Error starting protected instance:", error);
        throw error;
    }
};
