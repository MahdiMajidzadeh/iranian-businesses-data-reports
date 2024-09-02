<?php

function readFilesAndCreateJSON($directory) {
    $files = scandir($directory);
    $jsonData = [];

    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $filePath = $directory . '/' . $file;
            $fileName = basename($file, '.pdf'); // Remove extension

            // Extract year from filename
            $year = preg_match('/(\d{4})/', $fileName, $matches) ? $matches[1] : '';

            // Create tags array
            $tags = explode('-', $fileName);

            // Add file data to JSON array
            $jsonData[] = [
                'title' => $fileName,
                'url' => $file,
                'year' => $year,
                'tags' => $tags
            ];
        }
    }

    // Write JSON data to file
    file_put_contents('output.json', json_encode($jsonData, JSON_PRETTY_PRINT));
}

// Replace 'your_directory_path' with the actual directory path
readFilesAndCreateJSON('reports');