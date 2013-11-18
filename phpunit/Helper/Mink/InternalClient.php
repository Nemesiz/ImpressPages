<?php
/**
 * @package   ImpressPages
 */

namespace PhpUnit\Helper\Mink;

use Symfony\Component\BrowserKit\Client as BaseClient;
use Symfony\Component\BrowserKit\Response;

class InternalClient extends BaseClient
{
    /**
     * @param \Symfony\Component\BrowserKit\Request $request
     * @return Response
     * @throws \Exception
     * @throws CurlException
     */
    protected function doRequest($request)
    {
        $serverInfo = $request->getServer();

        $server = array(
            'REQUEST_URI' => parse_url($request->getUri(), PHP_URL_PATH),
            'REQUEST_METHOD' => $request->getMethod(),
            'SERVER_PORT' => 80,
            'SERVER_NAME' => $serverInfo['HTTP_HOST'],
        );

        $ipRequest = new \Ip\Request();
        $ipRequest->setServer($server);

        if ($request->getMethod() == 'GET') {
            $ipRequest->setGet($request->getParameters());
        } elseif ($request->getMethod() == 'POST') {
            $ipRequest->setPost($request->getParameters());
        }

        $application = new \Ip\Application(NULL);
        $ipResponse = $application->handleRequest($ipRequest);

        $response = new Response($ipResponse->getContent(), $ipResponse->getStatusCode(), $ipResponse->getHeaders());

        return $response;
    }
} 