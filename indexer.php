<?php

function readFilesAndCreateJSON($directory) {
    $files = scandir($directory);
    $jsonData = [];

    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $filePath = $directory . '/' . $file;
            $fileName = basename($filePath);
            $tags = explode('-', $fileName);
            $year = null;

            foreach ($tags as $tag) {
                if (is_numeric($tag)) {
                    $year = $tag;
                    break;
                }
            }

            $jsonData[] = [
                'title' => $fileName,
                'url' => $filePath,
                'year' => $year,
                'tags' => $tags,
            ];
        }
    }

    $jsonContent = json_encode($jsonData, JSON_PRETTY_PRINT);
    file_put_contents('output.json', $jsonContent);
}

// Replace 'your_directory_path' with the actual path to your directory
readFilesAndCreateJSON('reports');
