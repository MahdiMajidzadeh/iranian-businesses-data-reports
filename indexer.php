<?php

function readFilesAndCreateJSON($directory) {
    $files = scandir($directory);
    
    // Read existing data from output.json if it exists
    $outputFile = 'output.json';
    $jsonData = [];

    if (file_exists($outputFile)) {
        $jsonData = json_decode(file_get_contents($outputFile), true);
    }

    // Create an associative array for quick lookup by 'url'
    $existingUrls = array_column($jsonData, null, 'url');

    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $filePath = $directory . '/' . $file;
            $fileName = basename($file, '.pdf'); // Remove extension

            // Extract year from filename
            $year = preg_match('/(\d{4})/', $fileName, $matches) ? $matches[1] : '';

            // Create tags array
            $tags = explode('-', $fileName);

            // Check if the 'url' already exists in the existing data
            if (!isset($existingUrls[$file])) {
                // Add file data to JSON array only if the 'url' doesn't exist
                $jsonData[] = [
                    'title' => $fileName,
                    'url' => $file,
                    'year' => $year,
                    'tags' => $tags
                ];
            }
        }
    }

    // Write JSON data to file
    file_put_contents($outputFile, json_encode($jsonData, JSON_PRETTY_PRINT));
}

// Replace 'your_directory_path' with the actual directory path
readFilesAndCreateJSON('reports');
