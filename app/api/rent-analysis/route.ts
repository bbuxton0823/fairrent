import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.address || !data.beds || !data.baths || !data.squareFeet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Run the Python script
    const result = await runRentAnalysis(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in rent analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze rent' },
      { status: 500 }
    );
  }
}

async function runRentAnalysis(propertyData: any) {
  return new Promise((resolve, reject) => {
    // Use the new rentcast_agent.py script with the virtual environment Python
    const pythonProcess = spawn(path.join(process.cwd(), 'venv', 'bin', 'python'), [
      path.join(process.cwd(), 'scripts', 'rentcast_agent.py')
    ]);
    
    // Send the property data to the Python script
    pythonProcess.stdin.write(JSON.stringify(propertyData));
    pythonProcess.stdin.end();
    
    // Collect stdout data
    let stdout = '';
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    // Collect stderr data
    let stderr = '';
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script exited with code:', code);
        console.error('Error output:', stderr);
        reject(new Error(`Python script failed with code ${code}`));
        return;
      }
      
      try {
        // Parse the JSON output
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (error) {
        console.error('Error parsing Python output:', error);
        console.error('Raw output:', stdout);
        reject(error);
      }
    });
  });
} 