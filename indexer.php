<?php
function create_json_file($directory, $output_file) {
    $files = scandir($directory);
    $data = [];

    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        $filenameWithoutExtension = pathinfo($file, PATHINFO_FILENAME);
        $year = substr($filenameWithoutExtension, strpos($filenameWithoutExtension, '-') + 1, 4);

        $data[] = [
            'title' => $filenameWithoutExtension,
            'url' => $file,
            'year' => intval($year),
            'tags' => [
                $year
            ]
        ];
    }

    // Sort the data by year in descending order
    usort($data, function ($a, $b) {
        return $b['year'] - $a['year'];
    });

    $json_data = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($output_file, $json_data);
}

// Replace with your desired directory and output file paths
$directory = 'reports';
$output_file = 'output.json';

create_json_file($directory, $output_file);
